import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubSubService } from './pubsub/pubsub.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PubSubService],
})
export class AppModule {}
