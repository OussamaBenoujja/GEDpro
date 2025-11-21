import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum InterviewStatus {
    SCHEDULED = 'SCHEDULED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class Interview extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    candidateId: string;

    @Prop({ required: true })
    organizationId: string;

    @Prop({ required: true })
    organizerId: string;

    @Prop({ type: [String], default: [] })
    participants: string[];

    @Prop({ required: true })
    startTime: Date;

    @Prop({ required: true })
    endTime: Date;

    @Prop()
    googleEventId: string;

    @Prop({
        type: String,
        enum: InterviewStatus,
        default: InterviewStatus.SCHEDULED,
    })
    status: InterviewStatus;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
