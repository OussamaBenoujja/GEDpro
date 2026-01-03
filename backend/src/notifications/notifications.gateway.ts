import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class NotificationsGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger = new Logger('NotificationsGateway');

    constructor(private jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        try {
            // Simplified Auth: Check for token in query or headers
            const token =
                client.handshake.auth?.token || client.handshake.headers?.authorization;

            if (!token) {
                // Allow anonymous for now if strict auth fails, or disconnect
                // client.disconnect();
                return;
            }

            // Verify token (Mock/Simplified verification used here relying on JwtService)
            // In production: const payload = this.jwtService.verify(token);
            // const orgId = payload.orgId;
            // await client.join(`org_${orgId}`);

            this.logger.log(`Client connected: ${client.id}`);
        } catch (e) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() organizationId: string,
    ) {
        client.join(`org_${organizationId}`);
        this.logger.log(`Client ${client.id} joined org_${organizationId}`);
        return { event: 'joinedRoom', data: organizationId };
    }

    sendToOrg(organizationId: string, event: string, payload: any) {
        this.server.to(`org_${organizationId}`).emit(event, payload);
    }
}
