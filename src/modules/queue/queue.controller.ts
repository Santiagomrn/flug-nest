import { Controller, Get, Inject, Injectable, Post } from '@nestjs/common';
import { Payload, Ctx } from '@nestjs/microservices';
import { ServiceBusMessage, ServiceBusReceiver } from '@azure/service-bus';
import {
  AzureServiceBusClientProxy,
  AzureServiceBusContext,
  Queue,
  Topic,
} from 'nestjs-azure-service-bus-transporter';
import { config } from '@config/index';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('servicebus')
@Controller('servicebus')
export class QueueController {
  constructor(
    @Inject('SB_CLIENT') private readonly sbClient: AzureServiceBusClientProxy,
  ) {}
  @Get('queue/emit')
  queueEmit(): string {
    this.sbClient.emit(config.azure.serviceBus.queueExample, {
      body: {
        test: 'queue',
      },
    });
    return 'ok';
  }

  @Get('topic/emit')
  topicEmit(): string {
    this.sbClient.emit(config.azure.serviceBus.queueExample, {
      body: {
        test: 'topic',
      },
    });
    return 'ok';
  }

  @Queue({
    queueName: config.azure.serviceBus.queueExample.name,
    receiveMode: 'peekLock',
    options: {
      autoCompleteMessages: true,
    },
  })
  handleQueuemessage(
    @Payload() data: ServiceBusMessage,
    @Ctx() context: AzureServiceBusContext,
  ) {
    const serviceBusReceiver: ServiceBusReceiver = context.getArgs()[0];
    console.log(data.body);
  }

  @Topic({
    topic: config.azure.serviceBus.topicExample.name,
    subscription: config.azure.serviceBus.topicExample.subscription,
    receiveMode: 'peekLock',
    options: {
      autoCompleteMessages: true,
    },
  })
  handleTopicmessage(
    @Payload() data: ServiceBusMessage,
    @Ctx() context: AzureServiceBusContext,
  ) {
    const serviceBusReceiver: ServiceBusReceiver = context.getArgs()[0];
    console.log(data.body);
  }
}
