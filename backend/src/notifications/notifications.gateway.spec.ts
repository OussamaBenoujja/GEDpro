import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsGateway } from './notifications.gateway';
import { JwtService } from '@nestjs/jwt';

describe('NotificationsGateway', () => {
    let gateway: NotificationsGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsGateway,
                {
                    provide: JwtService,
                    useValue: {
                        verify: jest.fn().mockReturnValue({ orgId: 'test-org' }),
                    },
                },
            ],
        }).compile();

        gateway = module.get<NotificationsGateway>(NotificationsGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
