"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Beity System API - نظام بيتي')
        .setDescription('The official API documentation for Beity System')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(process.env.PORT || 5778, '0.0.0.0');
    console.log(`Application is running on: http://localhost:5778`);
    console.log(`Swagger: http://localhost:5778/api-docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map