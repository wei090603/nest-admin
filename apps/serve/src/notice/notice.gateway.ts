import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NoticeService } from './notice.service';
import { Server, Socket } from 'socket.io';
import * as WebSocket from 'ws';

enum messageType {
  PUSH_MESSAGE = 'pushMessage', // 推送消息
  CUSTOMER_SERVICE = 'customerService', // 客服聊天
  CHAT = 'chat', // 用户私聊
  GROUP_CHAT = 'groupChat' // 群聊
} 

@WebSocketGateway(4001, {
  path: '',
  cors: { origin: '*' },
  transports: ['websocket']
})


export class NoticeGateway {
  constructor(private readonly noticeService: NoticeService) {}

  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage(messageType.PUSH_MESSAGE)
  pushMessage(@MessageBody() data: string, @ConnectedSocket() client: WebSocket): any {
    // console.log('收到消息 client:', client);
    client.send(JSON.stringify({ event: 'tmp', data: '这里是个临时信息' }));
    return {
      "event": "hello",
      "data": data,
      "msg": 'rustfisher.com'
    };
  }


}
