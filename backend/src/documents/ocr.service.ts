import { Injectable, Logger } from '@nestjs/common';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  async extractText(imageBuffer: Buffer): Promise<string> {
    this.logger.log('Starting OCR extraction...');
    const worker = await createWorker('eng');
    const ret = await worker.recognize(imageBuffer);
    await worker.terminate();

    this.logger.log(
      `OCR Completed. Extracted ${ret.data.text.length} characters.`,
    );
    return ret.data.text;
  }

  extractSkills(text: string): string[] {
    // Simple mock skill extraction
    const skillsToLookFor = [
      'Node.js',
      'NestJS',
      'MongoDB',
      'PostgreSQL',
      'TypeScript',
      'React',
      'Angular',
      'Java',
      'Python',
    ];
    const foundSkills = skillsToLookFor.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase()),
    );
    return foundSkills;
  }
}
