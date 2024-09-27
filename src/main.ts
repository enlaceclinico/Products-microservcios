import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { config } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger("productsMS-main");  
  //const app = await NestFactory.create(AppModule);
/* const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),  // Cambia a Fastify
   );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // Elimina propiedades que no están definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si se envían propiedades no definidas
   // transform: true,        // Convierte los tipos automáticamente según los DTOs
  }));*/
  // Habilitar CORS
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options:{
        port:config.port
      }
    },
  );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // Elimina propiedades que no están definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si se envían propiedades no definidas
   // transform: true,        // Convierte los tipos automáticamente según los DTOs
  }))
  //app.enableCors();

  await app.listen();
  //await app.listen(config.port); // Asegúrate de usar el puerto configurado
  logger.log(`Products MIcroservice  running on port : ${config.port}`);
}
bootstrap();
