import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private orgRepository: Repository<Organization>,
    ) { }

    async create(name: string): Promise<Organization> {
        // Simple creation for now, user linking happens in Auth
        const org = this.orgRepository.create({ name });
        return this.orgRepository.save(org);
    }

    async findOne(id: string): Promise<Organization | null> {
        return this.orgRepository.findOne({ where: { id } });
    }
}
