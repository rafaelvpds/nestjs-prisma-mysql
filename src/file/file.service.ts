import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
    async upload(file: Express.Multer.File, patch: string) {
        return writeFile(patch, file.buffer);
    }
}
