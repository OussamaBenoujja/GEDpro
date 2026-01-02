import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate, CandidateStatus } from './candidate.schema';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class CandidatesService {
    constructor(
        @InjectModel(Candidate.name)
        private candidateModel: Model<Candidate>,
        private notificationsService: NotificationsService,
    ) { }

    async create(data: Partial<Candidate>, userId: string, organizationId: string): Promise<Candidate> {
        const createdCandidate = new this.candidateModel({
            ...data,
            organizationId,
            status: CandidateStatus.NEW,
            history: [
                { status: CandidateStatus.NEW, date: new Date(), userId },
            ],
        });
        const saved = await createdCandidate.save();

        this.notificationsService.notifyNewApplication(
            organizationId,
            `${saved.firstName} ${saved.lastName}`
        );

        return saved;
    }

    async findAll(organizationId: string): Promise<Candidate[]> {
        return this.candidateModel.find({ organizationId }).exec();
    }

    async findOne(id: string, organizationId: string): Promise<Candidate> {
        const candidate = await this.candidateModel.findOne({ _id: id, organizationId }).exec();
        if (!candidate) {
            throw new NotFoundException('Candidate not found');
        }
        return candidate;
    }

    async updateStatus(id: string, status: CandidateStatus, userId: string, organizationId: string): Promise<Candidate> {
        const candidate = await this.candidateModel.findOne({ _id: id, organizationId });
        if (!candidate) {
            throw new NotFoundException('Candidate not found');
        }

        candidate.status = status;
        candidate.history.push({
            status,
            date: new Date(),
            userId: 'system', // TODO: Pass actual user ID
        });
        const updated = await candidate.save();

        this.notificationsService.notifyCandidateUpdate(
            organizationId,
            `${updated.firstName} ${updated.lastName}`,
            status
        );

        return updated;
    }
}
