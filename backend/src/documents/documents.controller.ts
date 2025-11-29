import { Controller, Post, Get, Param, UseGuards, UseInterceptors, UploadedFile, Request, Res, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('upload')
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('candidateId') candidateId: string,
        @Request() req
    ) {
        return this.documentsService.upload(file, candidateId, req.user.orgId);
    }

    @Get(':id')
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    findOne(@Param('id') id: string, @Request() req) {
        return this.documentsService.findOne(id, req.user.orgId);
    }
}
