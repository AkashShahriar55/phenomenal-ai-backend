import { INestApplicationContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';

// guard types
export type AuthPayload = {
  userID: string;
  pollID: string;
  name: string;
};

export type SocketWithAuth = Socket & AuthPayload;

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number) {
    // const clientPort = parseInt(this.configService.get('CLIENT_PORT')!);

    // const cors = {
    //   origin: [
    //     `http://localhost:${clientPort}`,
    //     new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
    //   ],
    // };

    // this.logger.log('Configuring SocketIO server with custom CORS options', {
    //   cors,
    // });

    // const optionsWithCORS: ServerOptions = {
    //   ...options,
    //   cors,
    // };

    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port);

    server.of('panel').use(createTokenMiddleware(jwtService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketWithAuth, next) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug(`Validating auth token before connection: ${token}`);

    try {
      const payload = jwtService.verify(token);
      socket.userID = payload.sub;
      socket.pollID = payload.pollID;
      socket.name = payload.name;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };
