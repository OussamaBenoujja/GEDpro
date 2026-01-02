import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
    private readonly uploadDir = 'uploads';
    private readonly logger = new Logger(StorageService.name);

    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File): Promise<string> {
        const filename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadDir, filename);

        await fs.promises.writeFile(filePath, file.buffer);
        this.logger.log(`File saved locally: ${filePath}`);

        return filePath;
    }

    async deleteFile(filePath: string): Promise<void> {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            this.logger.log(`File deleted: ${filePath}`);
        }
    }
}
