import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
    constructor(private readonly gateway: NotificationsGateway) { }

    notifyCandidateUpdate(organizationId: string, candidateName: string, status: string) {
        this.gateway.sendToOrg(organizationId, 'candidate_update', {
            message: `Candidate ${candidateName} moved to ${status}`,
            candidateName,
            status,
            timestamp: new Date(),
        });
    }

    notifyNewApplication(organizationId: string, candidateName: string) {
        this.gateway.sendToOrg(organizationId, 'new_application', {
            message: `New application received: ${candidateName}`,
            candidateName,
            timestamp: new Date(),
        });
    }
}
