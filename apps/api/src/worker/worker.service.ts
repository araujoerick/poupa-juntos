import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Contribution } from '../entities/contribution.entity';
import { Group } from '../entities/group.entity';
import { ContributionsGateway } from '../contribution/contributions.gateway';
import { GeminiService } from '../gemini/gemini.service';
import { ContributionStatus } from '@poupa-juntos/shared-types';
import type { ContributionDTO } from '@poupa-juntos/shared-types';

interface SqsMessageBody {
  contributionId: string;
  receiptUrl: string;
  groupId: string;
}

function isSqsMessageBody(value: unknown): value is SqsMessageBody {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['contributionId'] === 'string' &&
    typeof v['receiptUrl'] === 'string' &&
    typeof v['groupId'] === 'string'
  );
}

// Gemini free tier: 10 RPM → 1 request per 6 seconds minimum
const GEMINI_MIN_INTERVAL_MS = 6_000;
const GEMINI_QUOTA_BACKOFF_MS = 60_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WorkerService.name);
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;
  private isRunning = false;
  private pollTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastGeminiCallAt = 0;

  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly geminiService: GeminiService,
    private readonly gateway: ContributionsGateway,
    private readonly config: ConfigService,
  ) {
    const region = config.getOrThrow<string>('AWS_REGION');
    const accessKeyId = config.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = config.getOrThrow<string>('AWS_SECRET_ACCESS_KEY');
    const sqsEndpoint = config.get<string>('SQS_ENDPOINT');

    this.sqs = new SQSClient({
      region,
      ...(sqsEndpoint ? { endpoint: sqsEndpoint } : {}),
      credentials: { accessKeyId, secretAccessKey },
    });

    this.queueUrl = config.getOrThrow<string>('SQS_QUEUE_URL');
  }

  onModuleInit(): void {
    this.isRunning = true;
    void this.schedulePoll();
    this.logger.log({ event: 'worker.started', entityId: 'sqs' });
  }

  onModuleDestroy(): void {
    this.isRunning = false;
    if (this.pollTimeout !== null) clearTimeout(this.pollTimeout);
    this.logger.log({ event: 'worker.stopped', entityId: 'sqs' });
  }

  private schedulePoll(): void {
    if (!this.isRunning) return;
    this.pollTimeout = setTimeout(() => {
      void this.pollQueue().finally(() => {
        this.schedulePoll();
      });
    }, 0);
  }

  private async pollQueue(): Promise<void> {
    try {
      const result = await this.sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          WaitTimeSeconds: 20,
          MaxNumberOfMessages: 10,
        }),
      );

      const messages = result.Messages ?? [];

      for (const message of messages) {
        if (!message.Body || !message.ReceiptHandle) continue;

        let body: unknown;
        try {
          body = JSON.parse(message.Body) as unknown;
        } catch {
          this.logger.error(
            {
              event: 'worker.parse.error',
              entityId: message.MessageId ?? 'unknown',
            },
            'Invalid JSON in SQS message',
          );
          continue;
        }

        if (!isSqsMessageBody(body)) {
          this.logger.error(
            {
              event: 'worker.invalid.body',
              entityId: message.MessageId ?? 'unknown',
            },
            'SQS message body missing required fields',
          );
          continue;
        }

        await this.processMessage(body, message.ReceiptHandle);
      }
    } catch (error) {
      this.logger.error(
        { event: 'worker.poll.error', entityId: 'sqs' },
        String(error),
      );
    }
  }

  private async processMessage(
    body: SqsMessageBody,
    receiptHandle: string,
  ): Promise<void> {
    const { contributionId, receiptUrl, groupId } = body;
    this.logger.log({ event: 'worker.processing', entityId: contributionId });

    try {
      const contribution = await this.contributionRepository.findOne({
        where: { id: contributionId },
      });

      if (!contribution) {
        this.logger.error(
          { event: 'worker.contribution.notfound', entityId: contributionId },
          'Contribution not found',
        );
        // Delete message to avoid infinite retry for non-existent contributions
        await this.deleteSqsMessage(receiptHandle);
        return;
      }

      await this.enforceGeminiRateLimit();

      let geminiResult: Awaited<
        ReturnType<typeof this.geminiService.analyzeReceipt>
      >;
      try {
        this.lastGeminiCallAt = Date.now();
        geminiResult = await this.geminiService.analyzeReceipt(receiptUrl);
      } catch (geminiError) {
        const msg = String(geminiError);
        const isQuotaError =
          msg.includes('429') ||
          msg.includes('quota') ||
          msg.includes('RESOURCE_EXHAUSTED');
        if (isQuotaError) {
          this.logger.error(
            { event: 'worker.gemini.quota', entityId: contributionId },
            `Gemini quota exceeded — backing off ${GEMINI_QUOTA_BACKOFF_MS / 1000}s`,
          );
          // Back off aggressively so we don't burn remaining quota
          this.lastGeminiCallAt =
            Date.now() + GEMINI_QUOTA_BACKOFF_MS - GEMINI_MIN_INTERVAL_MS;
          // Do NOT delete SQS message — retry after backoff
        }
        throw geminiError;
      }

      if (geminiResult.isValid) {
        const amount = Number(contribution.amount);

        contribution.status = ContributionStatus.VALIDATED;
        await this.contributionRepository.save(contribution);

        // Atomic SQL arithmetic to avoid race conditions
        await this.groupRepository.update(
          { id: groupId },
          {
            balance: () => `"balance" + ${amount}`,
            pendingBalance: () => `"pendingBalance" - ${amount}`,
          },
        );

        this.logger.log({
          event: 'contribution.validated',
          entityId: contributionId,
        });
      } else {
        const amount = Number(contribution.amount);

        contribution.status = ContributionStatus.REJECTED;
        await this.contributionRepository.save(contribution);

        await this.groupRepository.update(
          { id: groupId },
          {
            pendingBalance: () => `"pendingBalance" - ${amount}`,
          },
        );

        this.logger.log({
          event: 'contribution.rejected',
          entityId: contributionId,
        });
      }

      await this.deleteSqsMessage(receiptHandle);

      const dto: ContributionDTO = {
        id: contribution.id,
        amount: Number(contribution.amount),
        receiptUrl: contribution.receiptUrl,
        status: contribution.status,
        userId: contribution.userId,
        groupId: contribution.groupId,
        createdAt: contribution.createdAt.toISOString(),
      };
      this.gateway.emitContributionUpdate(groupId, dto);
    } catch (error) {
      this.logger.error(
        { event: 'worker.process.error', entityId: contributionId },
        String(error),
      );
      // Do NOT delete SQS message — it will become visible again after visibility timeout
    }
  }

  private async enforceGeminiRateLimit(): Promise<void> {
    const elapsed = Date.now() - this.lastGeminiCallAt;
    const wait = GEMINI_MIN_INTERVAL_MS - elapsed;
    if (wait > 0) {
      this.logger.log({
        event: 'worker.gemini.ratelimit',
        entityId: `waiting ${wait}ms`,
      });
      await sleep(wait);
    }
  }

  private async deleteSqsMessage(receiptHandle: string): Promise<void> {
    await this.sqs.send(
      new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      }),
    );
  }
}
