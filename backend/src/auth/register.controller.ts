import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { UserRole } from '../users/user.entity';

@Controller('register')
export class RegisterController {
    constructor(
        private usersService: UsersService,
        private organizationsService: OrganizationsService
    ) { }

    @Post()
    async register(@Body() body: any) {
        console.log('Registering user via RegisterController', body);
        return this.usersService.create(body);
    }

    @Post('company')
    async registerCompany(@Body() body: any) {
        console.log('Registering COMPANY via RegisterController', body);

        // 1. Create Organization
        const org = await this.organizationsService.create(body.companyName);

        // 2. Create Admin User linked to Org
        const userPayload = {
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            role: UserRole.ADMIN,
            organization: org, // TypeORM relation
        };

        return this.usersService.create(userPayload);
    }
}
