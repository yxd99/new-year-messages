import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { env } from '@infrastructure/config/env.js';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('API Token no proporcionado');
    }

    if (token !== env.API_TOKEN) {
      throw new UnauthorizedException('API Token inválido');
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const xApiToken = request.headers['x-api-token'];
    if (xApiToken) {
      return Array.isArray(xApiToken) ? xApiToken[0] : xApiToken;
    }

    const authorization = request.headers['authorization'];
    if (authorization) {
      const [type, token] = authorization.split(' ');
      if (type === 'Bearer') {
        return token;
      }
      return authorization;
    }

    return undefined;
  }
}
