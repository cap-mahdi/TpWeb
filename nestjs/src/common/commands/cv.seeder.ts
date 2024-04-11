import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { SkillService } from '../../skill/skill.service';
import {
  rand,
  randEmoji,
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

  const skillService = app.get(SkillService);
  const userService = app.get(UserService);
  const cvService = app.get(CvService);
  try {
    const users = await userService.findAll();
    const skills = await skillService.findAll();
    let promises = [];
    for (let user of users) {
      for (let i = 0; i < 3; i++) {
        const skillNumber = randNumber({ min: 2, max: 5 });
        let userSkills = new Set();
        for (let j = 0; j < skillNumber; j++) {
          userSkills.add(rand(skills));
        }
        const job = randJobTitle();
        const cv = await cvService.create({
          name: `${job} ${randEmoji()}`,
          firstName: randFirstName({ gender: 'male' }),
          age: randNumber({ min: 20, max: 25 }),
          cin: randNumber({ min: 10000000, max: 99999999 }),
          job: job,
          path: '',
          user: user,
          skills: Array.from(userSkills),
        });
        cvService.create(cv);
      }
    }

    await Promise.all(promises);
  } catch (e) {
    Logger.error(`Error while seeding cvs: ${e.message}`);
  }
  app.close();
}
bootstrap();
