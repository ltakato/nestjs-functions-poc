import { v2beta3 } from '@google-cloud/tasks';
import { google } from '@google-cloud/tasks/build/protos/protos';
import HttpMethod = google.cloud.tasks.v2.HttpMethod;
import { Injectable } from '@nestjs/common';

const MAX_SCHEDULE_LIMIT = 30 * 60 * 60 * 24; // Represents 30 days in seconds.

@Injectable()
export class TasksService {
  async createHttpTaskWithToken(
    project = 'my-project-id', // Your GCP Project id
    queue = 'my-queue', // Name of your Queue
    location = 'us-central1', // The GCP region of your queue
    url = 'https://example.com/taskhandler', // The full url path that the request will be sent to
    email = '<member>@<project-id>.iam.gserviceaccount.com', // Cloud IAM service account
    payload = {}, // The task HTTP request body
    date = new Date(), // Intended date to schedule task
  ) {
    // Instantiates a client.
    const client = new v2beta3.CloudTasksClient();

    // Construct the fully qualified queue name.
    const parent = client.queuePath(project, location, queue);

    // Convert message to buffer.
    const convertedPayload = JSON.stringify(payload);
    const body = Buffer.from(convertedPayload).toString('base64');

    const task = {
      httpRequest: {
        httpMethod: HttpMethod.POST,
        url,
        oidcToken: {
          serviceAccountEmail: email,
          audience: url,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      },
      scheduleTime: {
        seconds: null,
      },
    };

    const convertedDate = new Date(date);
    const currentDate = new Date();

    // Schedule time can not be in the past.
    if (convertedDate < currentDate) {
      console.error('Scheduled date in the past.');
    } else if (convertedDate > currentDate) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const date_diff_in_seconds = (convertedDate - currentDate) / 1000;
      // Restrict schedule time to the 30 day maximum.
      if (date_diff_in_seconds > MAX_SCHEDULE_LIMIT) {
        console.error('Schedule time is over 30 day maximum.');
      }
      // Construct future date in Unix time.
      const date_in_seconds =
        Math.min(date_diff_in_seconds, MAX_SCHEDULE_LIMIT) + Date.now() / 1000;
      // Add schedule time to request in Unix time using Timestamp structure.
      // https://googleapis.dev/nodejs/tasks/latest/google.protobuf.html#.Timestamp
      task.scheduleTime = {
        seconds: date_in_seconds,
      };
    }

    try {
      // Send create task request.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [response] = await client.createTask({ parent, task });
      console.log(`Created task ${response.name}`);
      return response.name;
    } catch (error) {
      // Construct error for Stackdriver Error Reporting
      console.error(Error(error.message));
    }
  }
}
