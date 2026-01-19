import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { Form } from './form.schema';
import { Public } from '../auth/public.decorator';

@Controller('forms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FormsController {
    constructor(private readonly formsService: FormsService) { }

    @Get('public')
    @Public()
    findPublished() {
        return this.formsService.findPublished();
    }

    @Get('public/:id')
    @Public()
    findPublishedOne(@Param('id') id: string) {
        return this.formsService.findPublishedOne(id);
    }

    @Post()
    @Roles(UserRole.HR, UserRole.ADMIN)
    create(@Body() formData: Partial<Form>, @Request() req) {
        return this.formsService.create(formData, req.user.orgId);
    }

    @Get()
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    findAll(@Request() req) {
        return this.formsService.findAll(req.user.orgId);
    }

    @Get(':id')
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    findOne(@Param('id') id: string, @Request() req) {
        return this.formsService.findOne(id, req.user.orgId);
    }

    @Delete(':id')
    @Roles(UserRole.HR, UserRole.ADMIN)
    remove(@Param('id') id: string, @Request() req) {
        return this.formsService.delete(id, req.user.orgId);
    }
}
