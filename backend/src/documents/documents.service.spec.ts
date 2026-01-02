import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { StorageService } from './storage.service';
import { OcrService } from './ocr.service';
import { getModelToken } from '@nestjs/mongoose';
import { DocMetadata } from './document.schema';

const mockDoc = {
    filename: 'test.pdf',
    save: jest.fn(),
};

const mockDocModel = {
    new: jest.fn().mockResolvedValue(mockDoc),
    constructor: jest.fn().mockResolvedValue(mockDoc),
    findOne: jest.fn(),
};

const mockStorageService = {
    saveFile: jest.fn().mockResolvedValue('uploads/test.pdf'),
};

const mockOcrService = {
    extractText: jest.fn().mockResolvedValue('Node.js developer'),
    extractSkills: jest.fn().mockReturnValue(['Node.js']),
};

describe('DocumentsService', () => {
    let service: DocumentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentsService,
                { provide: getModelToken(DocMetadata.name), useValue: mockDocModel },
                { provide: StorageService, useValue: mockStorageService },
                { provide: OcrService, useValue: mockOcrService },
            ],
        }).compile();

        service = module.get<DocumentsService>(DocumentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
