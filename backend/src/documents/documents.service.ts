import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocMetadata } from './document.schema';
import { StorageService } from './storage.service';
import { OcrService } from './ocr.service';
import { CvParserService } from './cv-parser.service';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectModel(DocMetadata.name)
        private docModel: Model<DocMetadata>,
        private storageService: StorageService,
        private ocrService: OcrService,
        private cvParserService: CvParserService,
    ) { }

    async upload(
        file: Express.Multer.File,
        candidateId: string,
        organizationId: string,
    ): Promise<DocMetadata> {
        // 1. Save File
        const filePath = await this.storageService.saveFile(file);

        let extractedText = '';
        let skills: string[] = [];
        let cvData: any = {};

        // 2a. CV Parsing (PDF) - AI Powered
        if (file.mimetype === 'application/pdf') {
            try {
                cvData = await this.cvParserService.parse(file.buffer);
                // Map AI result to our metadata structure
                extractedText = 'Extracted via AI Parser';
                skills = cvData.skills || [];
            } catch (error) {
                console.error('CV Parser Error:', error);
                // Fallback? Or just log? For now, we proceed with basic info.
            }
        }
        // 2b. OCR (Images) - Legacy Tesseract
        else if (file.mimetype.startsWith('image/')) {
            extractedText = await this.ocrService.extractText(file.buffer);
            skills = this.ocrService.extractSkills(extractedText);
        }

        // 3. Save Metadata
        const newDoc = new this.docModel({
            filename: file.originalname,
            path: filePath,
            mimetype: file.mimetype,
            size: file.size,
            candidateId,
            organizationId,
            extractedText,
            skills,
            // Spread structured data if available (Schema handles optional fields)
            ...cvData
        });

        return newDoc.save();
    }

    async findOne(id: string, organizationId: string): Promise<DocMetadata> {
        const doc = await this.docModel.findOne({ _id: id, organizationId }).exec();
        if (!doc) throw new NotFoundException('Document not found');
        return doc;
    }
}
