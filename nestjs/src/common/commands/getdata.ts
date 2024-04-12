import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { SkillService } from '../../skill/skill.service';
import {
  rand,
  randFileName,
  randFirstName,
  randJobTitle,
  randNumber,
  randOctal,
  randUserName,
} from '@ngneat/falso';
import { UserService } from '../../user/user.service';
import { CvService } from '../../cv/cv.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const cvService = app.get(CvService);
  try {
    const cvs = await cvService.findAll();
    for (let cv of cvs) {
    }
  } catch (e) {
    Logger.error(`Error while seeding cvs: ${e.message}`);
  }
  app.close();
}
bootstrap();
