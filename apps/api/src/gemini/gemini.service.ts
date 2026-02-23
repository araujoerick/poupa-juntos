import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiReceiptResult } from '@poupa-juntos/shared-types';

const RECEIPT_PROMPT =
  'Analise este comprovante bancário e extraia: valor transferido, data, tipo de operação (PIX/TED/DOC) e nome do destinatário. Retorne JSON: { amount: number, date: string, type: string, recipient: string, isValid: boolean }';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly model: ReturnType<
    InstanceType<typeof GoogleGenerativeAI>['getGenerativeModel']
  >;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.getOrThrow<string>('GEMINI_API_KEY');
    const ai = new GoogleGenerativeAI(apiKey);

    this.model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });
  }

  async analyzeReceipt(imageUrl: string): Promise<GeminiReceiptResult> {
    this.logger.log({ event: 'gemini.analyzing', entityId: imageUrl });

    try {
      const response = await fetch(imageUrl);
      if (!response.ok)
        throw new Error(`Fetch image failed: ${response.statusText}`);

      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = response.headers.get('content-type') ?? 'image/jpeg';

      const result = await this.model.generateContent([
        RECEIPT_PROMPT,
        { inlineData: { mimeType, data: base64 } },
      ]);

      // Com responseMimeType: 'application/json', o text() já vem como JSON puro
      const text = result.response.text();
      const parsed: unknown = JSON.parse(text) as unknown;

      if (!isGeminiReceiptResult(parsed)) {
        throw new Error('Invalid response schema from AI');
      }

      return parsed;
    } catch (error) {
      this.logger.error(
        { event: 'gemini.error', entityId: imageUrl },
        String(error),
      );
      throw new InternalServerErrorException(
        'Erro ao processar comprovante com IA',
      );
    }
  }
}

function isGeminiReceiptResult(value: unknown): value is GeminiReceiptResult {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['amount'] === 'number' &&
    typeof v['date'] === 'string' &&
    typeof v['type'] === 'string' &&
    typeof v['recipient'] === 'string' &&
    typeof v['isValid'] === 'boolean'
  );
}
