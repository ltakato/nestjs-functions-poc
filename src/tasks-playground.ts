import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService } from './tasks/tasks.service';
import { ConfigService } from '@nestjs/config';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const tasksService = app.get(TasksService);
  const configService = app.get(ConfigService);

  const GOOGLE_CLOUD_PROJECT = configService.get<string>(
    'GOOGLE_CLOUD_PROJECT',
  );
  const QUEUE_NAME = configService.get<string>('QUEUE_NAME');
  const QUEUE_LOCATION = 'us-central1';
  const FUNCTION_URL = configService.get<string>('FUNCTION_URL');
  const SERVICE_ACCOUNT_EMAIL = configService.get<string>(
    'SERVICE_ACCOUNT_EMAIL',
  );
  const payload = { message: 'task cat test!' };
  const date = new Date();

  console.log('creating task...');

  await tasksService.createHttpTaskWithToken(
    GOOGLE_CLOUD_PROJECT,
    QUEUE_NAME,
    QUEUE_LOCATION,
    FUNCTION_URL,
    SERVICE_ACCOUNT_EMAIL,
    payload,
    date,
  );

  console.log('task successfully created!');

  await app.close();
})();
