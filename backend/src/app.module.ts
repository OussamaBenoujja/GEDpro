import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, ConnectionStates } from 'mongoose';
import { CandidatesModule } from './candidates/candidates.module';
import { FormsModule } from './forms/forms.module';
import { InterviewsModule } from './interviews/interviews.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Organization } from './organizations/organization.entity';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/gedpro', {
      connectionFactory: (connection: Connection) => {
        if (connection.readyState === ConnectionStates.connected) {
          console.log('Connected successfully to the Mongo Database');
        }
        connection.on('connected', () => {
          console.log('Connected successfully to the Mongo Database');
        });
        return connection;
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'gedpro',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    CandidatesModule,
    FormsModule,
    InterviewsModule,
    DocumentsModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
  ],
})
export class AppModule { }
