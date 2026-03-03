import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class AttendanceGateway {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    console.log('WebSocket server initialized');
  }

  // Create attendance
  broadcastAttendanceCreate(payload: any) {
    this.server.emit('attendance_create', payload);
  }

  // Update attendance
  broadcastAttendanceUpdate(payload: any) {
    this.server.emit('attendance_update', payload);
  }
}
