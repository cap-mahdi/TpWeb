import { Controller, UploadedFile, UseInterceptors, Post, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { join } from 'path';

@Controller('cv')
export class CvController {


    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    public async uploadImage(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: /image\/(jpeg|png|jpg)/ })
                .addMaxSizeValidator({ maxSize: 1024 * 1024 })
                .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
        ) file) {

        const fileName = file.originalname;
        const filePath = join(process.cwd(), 'public', fileName)

        try {
            await fs.writeFile(filePath, file.buffer);
            return { success: true, message: 'File uploaded successfully.' }
        } catch (error) {
            return { success: false, message: 'Failed to upload file.' }
        }
    }
}
