import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { User } from '../../entities';
import { UserRole } from 'src/user/dto/userRole.dto';

const users: Omit<User, 'id' | 'cv' | 'role'>[] = [
  {
    userName: 'houssem',
    email: 'houssem@gmail.com',
    password: 'houssem',
  },
  {
    userName: 'medAmineGdoura',
    email: 'gdoura@gmail.com',
    password: 'gdoura',
  },
  {
    userName: 'hups',
    email: 'khelil@gmail.com',
    password: 'khelil',
  },
  {
    userName: 'mehdi',
    email: 'fkih@gmail.com',
    password: 'fkih',
  },
  {
    userName: 'mahdi02ch',
    email: 'mahdi@gmail.com',
    password: 'mahdi',
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  try {
    const promises = users.map((user) => {
      return userService.create(user);
    });
    await Promise.all(promises);
  } catch (e) {
    Logger.error(`Error while seeding user: ${e.message}`);
  }
  app.close();
}
bootstrap();
