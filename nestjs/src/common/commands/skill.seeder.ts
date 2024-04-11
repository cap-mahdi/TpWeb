import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Logger } from '@nestjs/common';
import { SkillService } from '../../skill/skill.service';
import { randSkill } from '@ngneat/falso';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const skillService = app.get(SkillService);
  try {
    const promises = Array.from({ length: 50 }).map(() => {
      return skillService.create({
        designation: randSkill(),
      });
    });
    await Promise.all(promises);
  } catch (e) {
    Logger.error(`Error while seeding skill: ${e.message}`);
  }
  app.close();
}
bootstrap();
