import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { Candidate, CandidateSchema } from './candidate.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Candidate.name, schema: CandidateSchema }]),
        NotificationsModule,
    ],
    controllers: [CandidatesController],
    providers: [CandidatesService],
})
export class CandidatesModule { }
