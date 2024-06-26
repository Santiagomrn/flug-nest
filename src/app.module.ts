import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './core/database/database';
import { NoteModule } from '@modules/note/note.module';
import { EmailModule } from '@modules/email/email.module';
import { QueueModule } from '@modules/queue/queue.module';
import { WebsocketModule } from '@modules/websocket/websocket.module';

@Module({
  imports: [
    DatabaseModule,
    EmailModule,
    UserModule,
    AuthModule,
    NoteModule,
    QueueModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
