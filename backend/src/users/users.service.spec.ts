import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

const mockUserRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: MockRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: mockUserRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<MockRepository>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should successfully insert a user', async () => {
            const mockUserDto = {
                email: 'test@example.com',
                password: 'password',
                firstName: 'Test',
                lastName: 'User',
            };
            const savedUser = {
                id: 'uuid',
                ...mockUserDto,
                password: 'hashedPassword',
                role: 'HR',
                organizationId: 'org1',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            userRepository.create.mockReturnValue(savedUser);
            userRepository.save.mockResolvedValue(savedUser);

            const result = await service.create(mockUserDto);
            expect(result).toEqual(savedUser);
            expect(userRepository.create).toHaveBeenCalled();
            expect(userRepository.save).toHaveBeenCalled();
        });
    });
});
