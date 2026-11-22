import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/availability', cors: { origin: process.env.WEB_URL ?? 'http://localhost:3000', credentials: true } })
export class RealtimeGateway {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(RealtimeGateway.name);

  // This gateway only handles subscriptions. Authoritative booking events must be
  // emitted by backend services after the database transaction commits.
  @SubscribeMessage('availability.subscribe')
  async subscribe(@ConnectedSocket() client: Socket, @MessageBody() body: { resourceId?: string }) {
    if (!body?.resourceId || !/^[a-zA-Z0-9_-]{1,80}$/.test(body.resourceId)) return { ok: false, error: 'Invalid resourceId' };
    await client.join(`resource:${body.resourceId}`);
    this.logger.debug(`Socket ${client.id} subscribed to resource ${body.resourceId}`);
    return { ok: true, resourceId: body.resourceId };
  }

  @SubscribeMessage('availability.unsubscribe')
  async unsubscribe(@ConnectedSocket() client: Socket, @MessageBody() body: { resourceId?: string }) {
    if (!body?.resourceId) return { ok: false, error: 'resourceId is required' };
    await client.leave(`resource:${body.resourceId}`);
    return { ok: true, resourceId: body.resourceId };
  }

  publishAvailability(resourceId: string, payload: { version: number; updatedAt: string }) {
    this.server.to(`resource:${resourceId}`).emit('availability.updated', payload);
  }
}
