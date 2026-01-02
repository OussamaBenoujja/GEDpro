import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interview, InterviewStatus } from './interview.schema';
import { GoogleCalendarService } from './google-calendar.service';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class InterviewsService {
    constructor(
        @InjectModel(Interview.name)
        private interviewModel: Model<Interview>,
        private googleCalendarService: GoogleCalendarService,
        private emailService: EmailService,
    ) { }

    async schedule(
        data: Partial<Interview>,
        organizerId: string,
        organizationId: string,
    ): Promise<Interview> {

        // 1. Create Google Calendar Event
        const googleEvent = await this.googleCalendarService.createEvent(
            data.title || 'Interview',
            'Job Interview',
            new Date(data.startTime || Date.now()),
            new Date(data.endTime || Date.now()),
            data.participants || [],
        );

        // 2. Save to DB
        const newInterview = new this.interviewModel({
            ...data,
            organizerId,
            organizationId,
            googleEventId: googleEvent.id,
            status: InterviewStatus.SCHEDULED,
        });

        const savedInterview = await newInterview.save();

        // 3. Send Email Invites (ICS)
        if (data.participants && data.participants.length > 0) {
            this.emailService.sendInterviewInvite(
                data.participants,
                data.title || 'Job Interview',
                `Interview for candidate ${data.candidateId}`,
                new Date(data.startTime || Date.now()),
                new Date(data.endTime || Date.now()),
                undefined,
                undefined,
                googleEvent.meetingLink || 'https://meet.google.com/abc-defg-hij',
            );
        }

        return savedInterview;
    }

    async findAll(organizationId: string): Promise<Interview[]> {
        return this.interviewModel.find({ organizationId }).sort({ startTime: 1 }).exec();
    }

    async cancel(id: string, organizationId: string): Promise<Interview> {
        const interview = await this.interviewModel.findOne({ _id: id, organizationId });
        if (!interview) {
            throw new NotFoundException('Interview not found');
        }

        if (interview.googleEventId) {
            await this.googleCalendarService.deleteEvent(interview.googleEventId);
        }

        interview.status = InterviewStatus.CANCELLED;
        return interview.save();
    }
}
