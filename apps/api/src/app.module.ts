import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { RoomsService } from './rooms/rooms.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventsGateway, RoomsService],
})
export class AppModule {}
