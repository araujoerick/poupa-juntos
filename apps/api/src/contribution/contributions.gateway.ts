import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { ContributionDTO } from '@poupa-juntos/shared-types';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ContributionsGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ContributionsGateway.name);

  @SubscribeMessage('join-group')
  handleJoinGroup(
    @MessageBody() groupId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    void client.join(`group:${groupId}`);
    this.logger.log({ event: 'gateway.join', entityId: groupId });
  }

  emitContributionUpdate(groupId: string, payload: ContributionDTO): void {
    this.server.to(`group:${groupId}`).emit('contribution:updated', payload);
    this.logger.log({ event: 'gateway.emit', entityId: groupId });
  }
}
