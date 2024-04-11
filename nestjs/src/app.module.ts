import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CvModule } from './cv/cv.module';
import { SkillModule } from './skill/skill.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Cv, Skill } from './entities';

@Module({
  imports: [
    UserModule,
    CvModule,
    SkillModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://postgres.grtubrwhpvubmoqgexnc:X7TFIm6g8EaGGy70@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
      // entities: [User, Cv, Skill],
      // synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
