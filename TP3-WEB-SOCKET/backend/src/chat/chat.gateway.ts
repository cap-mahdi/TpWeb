import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
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
    origin: ['http://localhost:5173'],
  },
})
export class ChatGateway implements OnModuleInit, OnGatewayConnection {
  connecterUsers: Map<string, string> = new Map();

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
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: MessagePayload,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Client id', client.id);
    console.log('Message received', message);
    this.server
      .to(this.connecterUsers.get(message.userId))
      .emit('message', message);
  }

  @SubscribeMessage('heart')
  handleHeart(@MessageBody() heart: any) {
    console.log('Heart received', heart);
    this.server.emit('heart', heart);
  }

  @SubscribeMessage('login')
  handleLogin(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Login received', data);
    this.connecterUsers.set(data.userId, client.id);
    console.log('Connected users', this.connecterUsers);

    // this.server.emit('users', this.list);
  }
}
