import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { Interview } from './interview.schema';

@Controller('interviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InterviewsController {
    constructor(private readonly interviewsService: InterviewsService) { }

    @Post()
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    create(@Body() data: Partial<Interview>, @Request() req) {
        return this.interviewsService.schedule(data, req.user.userId, req.user.orgId);
    }

    @Get()
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    findAll(@Request() req) {
        return this.interviewsService.findAll(req.user.orgId);
    }

    @Delete(':id')
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    cancel(@Param('id') id: string, @Request() req) {
        return this.interviewsService.cancel(id, req.user.orgId);
    }
}
