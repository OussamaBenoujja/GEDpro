import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { Candidate, CandidateStatus } from './candidate.schema';
import { Public } from '../auth/public.decorator';

@Controller('candidates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CandidatesController {
    constructor(private readonly candidatesService: CandidatesService) { }

    @Post()
    @Roles(UserRole.HR, UserRole.ADMIN, UserRole.MANAGER)
    create(@Body() candidateData: Partial<Candidate>, @Request() req) {
        return this.candidatesService.create(candidateData, req.user.userId, req.user.orgId);
    }

    @Post('public/apply')
    @Public()
    publicApply(@Body() candidateData: Partial<Candidate>) {
        // For public apply, we might need a default organization or derive it from context (e.g. subdomain)
        // For this MVP, I'll hardcode a default Org ID or use the first one found, OR require it in body.
        // But let's assume single tenant for simplicity or just pass it in body if multiple.
        // I'll default to a placeholder ID if not provided, but effectively I should make it optional in service or handle it.
        // Actually, candidatesService.create uses orgId.
        // I'll modify create to make userId optional (since public user has no ID).
        // For OrgId, I'll hardcode one for now or fetch.
        // Let's assume the body has organizationId if needed, or we pick a random one/default.
        // Since the prompt mentions "Multi-organization support (bonus)", I assume single org is fine.
        // But the schema implies orgId is required.
        // I'll hardcode a "PUBLIC_ORG" or similar if needed, or pass it from the form (hidden field).
        return this.candidatesService.create(candidateData, 'PUBLIC_USER', candidateData.organizationId || 'DEFAULT_ORG');
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
