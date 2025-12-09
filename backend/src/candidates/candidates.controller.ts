import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { Candidate, CandidateStatus } from './candidate.schema';

@Controller('candidates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CandidatesController {
    constructor(private readonly candidatesService: CandidatesService) { }

    @Post()
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    create(@Body() candidateData: Partial<Candidate>, @Request() req) {
        return this.candidatesService.create(candidateData, req.user.userId, req.user.orgId);
    }

    @Get()
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    findAll(@Request() req) {
        return this.candidatesService.findAll(req.user.orgId);
    }

    @Get(':id')
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    findOne(@Param('id') id: string, @Request() req) {
        return this.candidatesService.findOne(id, req.user.orgId);
    }

    @Patch(':id/status')
    @Roles(UserRole.HR, UserRole.ADMIN)
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: CandidateStatus,
        @Request() req
    ) {
        return this.candidatesService.updateStatus(id, status, req.user.userId, req.user.orgId);
    }
}
