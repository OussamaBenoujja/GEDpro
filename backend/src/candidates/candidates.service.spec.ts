import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesService } from './candidates.service';
import { getModelToken } from '@nestjs/mongoose';
import { Candidate } from './candidate.schema';
import { NotificationsService } from '../notifications/notifications.service';

const mockCandidate = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    organizationId: 'org1',
    status: 'NEW',
    history: [],
    save: jest.fn(),
};

const mockCandidateModel = {
    new: jest.fn().mockResolvedValue(mockCandidate),
    constructor: jest.fn().mockResolvedValue(mockCandidate),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
};

const mockNotificationsService = {
    notifyNewApplication: jest.fn(),
    notifyCandidateUpdate: jest.fn(),
};

describe('CandidatesService', () => {
    let service: CandidatesService;
    let model: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CandidatesService,
                {
                    provide: getModelToken(Candidate.name),
                    useValue: mockCandidateModel,
                },
                {
                    provide: NotificationsService,
                    useValue: mockNotificationsService,
                },
            ],
        }).compile();

        service = module.get<CandidatesService>(CandidatesService);
        model = module.get(getModelToken(Candidate.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
