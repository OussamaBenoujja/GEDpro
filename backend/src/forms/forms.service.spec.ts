import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from './forms.service';
import { getModelToken } from '@nestjs/mongoose';
import { Form } from './form.schema';

const mockForm = {
    title: 'Test Form',
    organizationId: 'org1',
    fields: [],
    save: jest.fn(),
};

const mockFormModel = {
    new: jest.fn().mockResolvedValue(mockForm),
    constructor: jest.fn().mockResolvedValue(mockForm),
    find: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    exec: jest.fn(),
};

describe('FormsService', () => {
    let service: FormsService;
    let model: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FormsService,
                {
                    provide: getModelToken(Form.name),
                    useValue: mockFormModel,
                },
            ],
        }).compile();

        service = module.get<FormsService>(FormsService);
        model = module.get(getModelToken(Form.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
