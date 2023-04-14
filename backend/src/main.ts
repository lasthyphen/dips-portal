import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { Env } from "./env";

import { MongoExceptionFilter } from "./exceptions/mongodb-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule
  );
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle("Parse dips project")
    .setDescription(
      "This project is a DIPs Tracker for MakerDAO Improvement Proposals. DIPs projects."
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("doc", app, document);

  const port = configService.get<number>(Env.Port) || 3000;

  app.useGlobalFilters(new MongoExceptionFilter());

  await app.listen(port);
  console.log(`Application running at ${port} port`);
}
bootstrap();
