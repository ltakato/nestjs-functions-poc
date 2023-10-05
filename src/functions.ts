import { google } from '@google-cloud/pubsub/build/protos/protos';
import PubsubMessage = google.pubsub.v1.PubsubMessage;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

exports.callCat = async (message: PubsubMessage) => {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('logging incoming message: ', JSON.stringify(message));

  const service = app.get(AppService);

  console.log('logging hello: ', service.callCat());
};

exports.greetCat = async (message: PubsubMessage) => {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('logging incoming message: ', JSON.stringify(message));

  const service = app.get(AppService);

  console.log('logging hello: ', service.greetCat());
};
