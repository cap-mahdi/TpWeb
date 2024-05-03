import { OnModuleInit } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


interface MessagePayload {
  id: string;
  text: string;
  userId: string | null;
}


interface HeartPayload {
  messageId: string;
  userId: string;
}

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:5173"]
  }
})
export class ChatGateway implements OnModuleInit, OnGatewayConnection {
  handleConnection(client: Socket) {
    const connectionId = client.id;
    client.emit('connection-id', connectionId);
  }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('New client connected', socket.id);
      return socket.id;
    })
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: MessagePayload) {
    console.log('Message received', message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('heart')
  handleHeart(@MessageBody() heart: any) {
    console.log('Heart received', heart);
    this.server.emit('heart', heart);
  }

}
