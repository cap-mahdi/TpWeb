import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { User } from '../../entities/user.entity';
import { Logger } from '@nestjs/common';
import { UserService } from '../../user/user.service';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  try {
    const user = new User();
    user.userName = 'admin';
    user.password = 'admin';
    user.email = 'admin@gmail.com';
    await userService.create(user);
  } catch (e) {
    Logger.error(`Erro while seeding user: ${e.message}`);
  } finally {
    await app.close();
  }
}
bootstrap();
