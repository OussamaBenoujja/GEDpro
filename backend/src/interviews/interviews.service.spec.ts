import { Test, TestingModule } from '@nestjs/testing';
import { InterviewsService } from './interviews.service';
import { GoogleCalendarService } from './google-calendar.service';
import { getModelToken } from '@nestjs/mongoose';
import { Interview } from './interview.schema';

const mockInterview = {
    title: 'Interview',
    startTime: new Date(),
    save: jest.fn(),
};

const mockInterviewModel = {
    new: jest.fn().mockResolvedValue(mockInterview),
    constructor: jest.fn().mockResolvedValue(mockInterview),
    find: jest.fn(),
    findOne: jest.fn(),
    exec: jest.fn(),
};

const mockCalendarService = {
    createEvent: jest.fn().mockResolvedValue('mock_id'),
    deleteEvent: jest.fn(),
};

describe('InterviewsService', () => {
    let service: InterviewsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InterviewsService,
                {
                    provide: getModelToken(Interview.name),
                    useValue: mockInterviewModel,
                },
                {
                    provide: GoogleCalendarService,
                    useValue: mockCalendarService,
                },
            ],
        }).compile();

        service = module.get<InterviewsService>(InterviewsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
