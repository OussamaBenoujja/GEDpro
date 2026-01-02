import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { GoogleCalendarService } from './google-calendar.service';
import { Interview, InterviewSchema } from './interview.schema';

import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Interview.name, schema: InterviewSchema }]),
        NotificationsModule,
    ],
    controllers: [InterviewsController],
    providers: [InterviewsService, GoogleCalendarService],
})
export class InterviewsModule { }
