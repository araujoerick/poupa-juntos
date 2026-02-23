import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Contribution } from '../entities/contribution.entity';
import { Group } from '../entities/group.entity';
import { User } from '../entities/user.entity';
import { ContributionStatus } from '@poupa-juntos/shared-types';
import type { ContributionDTO } from '@poupa-juntos/shared-types';
import { CreateContributionDto } from './dto/create-contribution.dto';

@Injectable()
export class ContributionService {
  private readonly logger = new Logger(ContributionService.name);
  private readonly s3: S3Client;
  private readonly sqs: SQSClient;
  private readonly bucketName: string;
  private readonly queueUrl: string;
  private readonly s3Endpoint: string | undefined;

  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
  ) {
    const region = config.getOrThrow<string>('AWS_REGION');
    const accessKeyId = config.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = config.getOrThrow<string>('AWS_SECRET_ACCESS_KEY');

    const s3Endpoint = config.get<string>('S3_ENDPOINT');
    this.s3Endpoint = s3Endpoint;
    this.s3 = new S3Client({
      region,
      ...(s3Endpoint ? { endpoint: s3Endpoint, forcePathStyle: true } : {}),
      credentials: { accessKeyId, secretAccessKey },
    });

    const sqsEndpoint = config.get<string>('SQS_ENDPOINT');
    this.sqs = new SQSClient({
      region,
      ...(sqsEndpoint ? { endpoint: sqsEndpoint } : {}),
      credentials: { accessKeyId, secretAccessKey },
    });

    this.bucketName = config.getOrThrow<string>('S3_BUCKET_NAME');
    this.queueUrl = config.getOrThrow<string>('SQS_QUEUE_URL');
  }

  async create(
    file: Express.Multer.File,
    dto: CreateContributionDto,
    clerkId: string,
  ): Promise<ContributionDTO> {
    const user = await this.assertMember(dto.groupId, clerkId);

    const receiptUrl = await this.uploadToS3(
      file.buffer,
      file.mimetype,
      file.originalname,
    );

    const contribution = await this.dataSource.transaction(async (em) => {
      const saved = await em.save(
        em.create(Contribution, {
          amount: dto.amount,
          receiptUrl,
          status: ContributionStatus.PENDING,
          userId: user.id,
          groupId: dto.groupId,
        }),
      );

      await em.increment(
        Group,
        { id: dto.groupId },
        'pendingBalance',
        dto.amount,
      );

      await this.sqs.send(
        new SendMessageCommand({
          QueueUrl: this.queueUrl,
          MessageBody: JSON.stringify({
            contributionId: saved.id,
            receiptUrl,
            groupId: dto.groupId,
          }),
        }),
      );

      this.logger.log({
        event: 'contribution.created',
        entityId: saved.id,
      });

      return saved;
    });

    return this.toDto(contribution);
  }

  async findAllForGroup(
    groupId: string,
    clerkId: string,
  ): Promise<ContributionDTO[]> {
    await this.assertMember(groupId, clerkId);

    const contributions = await this.contributionRepository.find({
      where: { groupId },
      order: { createdAt: 'DESC' },
    });

    return contributions.map((c) => this.toDto(c));
  }

  private async uploadToS3(
    buffer: Buffer,
    mimetype: string,
    originalname: string,
  ): Promise<string> {
    const key = `receipts/${crypto.randomUUID()}-${originalname}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: mimetype,
        }),
      );
    } catch (error) {
      this.logger.error(
        { event: 's3.upload.error', entityId: key },
        String(error),
      );
      throw new InternalServerErrorException('Failed to upload receipt');
    }

    return this.s3Endpoint
      ? `${this.s3Endpoint}/${this.bucketName}/${key}`
      : `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }

  private async assertMember(groupId: string, clerkId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    if (!user) throw new NotFoundException('User not found');

    const group = await this.groupRepository
      .createQueryBuilder('group')
      .innerJoin('group.members', 'member', 'member.id = :userId', {
        userId: user.id,
      })
      .where('group.id = :groupId', { groupId })
      .andWhere('group.deletedAt IS NULL')
      .getOne();

    if (!group) throw new ForbiddenException('Access denied');

    return user;
  }

  private toDto(contribution: Contribution): ContributionDTO {
    return {
      id: contribution.id,
      amount: Number(contribution.amount),
      receiptUrl: contribution.receiptUrl,
      status: contribution.status,
      userId: contribution.userId,
      groupId: contribution.groupId,
      createdAt: contribution.createdAt.toISOString(),
    };
  }
}
