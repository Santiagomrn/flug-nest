import { Test } from '@nestjs/testing';
import { WebsocketGateway } from '../websocket.gateway';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe('WebsocketGateway', () => {
  let gateway: WebsocketGateway;
  let app: INestApplication;
  let ioClient: Socket;

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp(WebsocketGateway);
    // Get the gateway instance from the app instance
    gateway = app.get<WebsocketGateway>(WebsocketGateway);
    // Create a new client that will interact with the gateway
    ioClient = io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "events" on "events"', async () => {
    ioClient.connect();
    ioClient.emit('events', 'Hello world!');
    await new Promise<void>((resolve, reject) => {
      ioClient.on('connect', () => {
        console.log('connected');
      });
      ioClient.on('events', (data) => {
        try {
          expect(data).toBe('Hello world!');
          resolve();
        } catch (ex) {
          ioClient.disconnect();
          reject(ex);
        }
      });
    });
    ioClient.disconnect();
  });
});
