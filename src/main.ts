import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  const apiUrl = `http://localhost${port === '80' ? '' : ':' + port}`;
  setTimeout(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `\x1b[32m[Main] Server (API) is running on ${apiUrl}, in ${process.env.NODE_ENV} mode`,
      );
      // print all routes
      const server = app.getHttpServer();
      const router = server._events.request._router;
      // yellow
      console.log('\x1b[33m[Main] Routes:');
      router.stack.forEach((r) => {
        if (r.route && r.route.path) {
          console.log(apiUrl + r.route.path);
        }
      });
    }
  }, 50);
}

void bootstrap();
