import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CvModule } from './cv/cv.module';
import { SkillModule } from './skill/skill.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AutheticationMiddleware } from './middlewares';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    CvModule,
    SkillModule,
    AuthModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: 'postgres://postgres.grtubrwhpvubmoqgexnc:X7TFIm6g8EaGGy70@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
    //   synchronize: true,
    //   autoLoadEntities: true,
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get<string>('DATABASE_URL'),
        type: 'postgres',
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '60m' },
        global: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AutheticationMiddleware)
      .forRoutes("/protected")
  }
}
