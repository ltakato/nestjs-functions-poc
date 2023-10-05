import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService {
  private pubSubClient: PubSub;

  constructor() {
    this.pubSubClient = new PubSub();
  }

  async publishMessage(topicName: string, data: any): Promise<void> {
    const topic = this.pubSubClient.topic(topicName);
    const dataBuffer = Buffer.from(JSON.stringify(data));

    try {
      await topic.publish(dataBuffer);
      console.log(`Message published to topic ${topicName}`);
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }
}
