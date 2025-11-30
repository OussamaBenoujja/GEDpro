import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocMetadata, DocMetadataSchema } from './document.schema';
import { StorageService } from './storage.service';
import { OcrService } from './ocr.service';
import { CvParserService } from './cv-parser.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: DocMetadata.name, schema: DocMetadataSchema }]),
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService, StorageService, OcrService, CvParserService],
})
export class DocumentsModule { }
