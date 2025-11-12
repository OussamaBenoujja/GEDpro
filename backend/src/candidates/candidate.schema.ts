import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CandidateStatus {
    NEW = 'NEW',
    PRE_SELECTED = 'PRE_SELECTED',
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
    INTERVIEWING = 'INTERVIEWING',
    ACCEPTED = 'ACCEPTED',
    REFUSED = 'REFUSED',
}

@Schema({ timestamps: true })
export class Candidate extends Document {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({
        type: String,
        enum: CandidateStatus,
        default: CandidateStatus.NEW,
    })
    status: CandidateStatus;

    @Prop({ required: true })
    organizationId: string;

    @Prop([String])
    skills: string[];

    @Prop({ type: [{ status: String, date: Date, userId: String }] })
    history: {
        status: CandidateStatus;
        date: Date;
        userId: string;
    }[];
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
