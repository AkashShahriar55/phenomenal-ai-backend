import { Socket } from 'socket.io';
import { User } from '../users/domain/user';

export type AuthPayload = {
  user: User;
};

export type SocketWithAuth = Socket & AuthPayload;
