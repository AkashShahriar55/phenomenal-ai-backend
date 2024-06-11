import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
   
    const client = context.switchToWs().getClient();
    const {token} = client.handshake.query;
    console.log(`client -> ${token}`)

    if (!token) {
      throw new WsException('Missing token');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('auth.secret', {
          infer: true,
        }),
      });
      client.user = decoded;
      return true;
    } catch (err) {
        console.log(err)
      throw new WsException('Invalid token');
    }
  }
}
