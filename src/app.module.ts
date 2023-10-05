import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubSubService } from './pubsub/pubsub.service';
import { TasksService } from './tasks/tasks.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PubSubService, TasksService],
})
export class AppModule {}
