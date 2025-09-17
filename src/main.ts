import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {ClassSerializerInterceptor, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: {enableImplicitConversion: true}
  }));

  const options = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription('Fully working marketplace API with authentication, users, filters, roles, products, cart, wishlist, and categories')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
