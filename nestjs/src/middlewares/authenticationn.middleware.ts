import { Inject, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { log } from "console";
import { NextFunction, Request, Response } from "express";
import { User } from "src/entities";

@Injectable()
export class AutheticationMiddleware implements NestMiddleware {
    constructor(
        // @Inject(JwtService)
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const token = <string>req.headers['auth-user']
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')
                }
            );
            req['userId'] = payload.sub;
            log(payload)
        } catch {
            throw new UnauthorizedException();
        }

        next()
    }
}