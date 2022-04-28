import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SocketIoAdapter } from './multi/adapter/socket-io.adapter';

declare const module: any;
const port = process.env.PORT || 80;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS TEMPLATE')
    .setDescription('BASIC NESTJS TEMPLATE')
    .setVersion('1.0')
    .addTag('NESTJS TEMPLATE')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 현석: socket.io 설정
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
