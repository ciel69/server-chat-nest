import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server;

  @SubscribeMessage('events')
  findAll(client, data): WsResponse<any> {
    console.log('data', data);
    const event = 'events';
    return { event, data };
  }

  @SubscribeMessage('identity')
  async identity(client, data: any): Promise<any> {
    return data;
  }
}
