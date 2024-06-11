import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { config } from '@config/index';
import { AzureServiceBusModule } from 'nestjs-azure-service-bus-transporter';

@Module({
  imports: [
    AzureServiceBusModule.forRoot([
      {
        name: 'SB_CLIENT',
        connectionString: config.azure.serviceBus.connectionString,
        options: {},
      },
    ]),
  ],
  controllers: [QueueController],
})
export class QueueModule {}
