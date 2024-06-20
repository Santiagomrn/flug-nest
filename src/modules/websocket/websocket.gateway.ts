import { Logger } from '@core/logger/Logger';
import { OnApplicationShutdown } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect<Socket>,
    OnApplicationShutdown
{
  private readonly logger = new Logger(WebsocketGateway.name);
  @WebSocketServer()
  private io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: unknown,
  ) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.io.close();
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  @SubscribeMessage('events')
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'events',
      data,
    };
  }
  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
  onApplicationShutdown(signal?: string) {
    this.close();
  }
  close() {
    this.io.close();
  }
}
