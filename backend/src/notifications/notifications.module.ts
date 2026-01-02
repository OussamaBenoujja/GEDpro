import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { EmailService } from './email.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: 'SECRET_KEY_HERE', // Should use env var
            signOptions: { expiresIn: '60m' },
        }),
    ],
    providers: [NotificationsGateway, NotificationsService, EmailService],
    exports: [NotificationsService, EmailService],
})
export class NotificationsModule { }
