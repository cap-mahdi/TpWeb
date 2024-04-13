import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { Cv, Skill, User } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AutheticationMiddleware } from 'src/middlewares';
import { RequestMethod } from '@nestjs/common/enums/request-method.enum';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [TypeOrmModule.forFeature([Cv, Skill, User]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
      signOptions: { expiresIn: '60m' },
      global: true,
    }),
    inject: [ConfigService],
  }),],

  controllers: [CvController],
  providers: [CvService],
})
export class CvModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AutheticationMiddleware)
      .forRoutes({ path: '/cv', method: RequestMethod.POST });
  }
}
