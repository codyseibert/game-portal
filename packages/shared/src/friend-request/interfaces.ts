import { IUser } from '../user';
import { FriendRequestStatus } from '../enums';
import { IEntity } from '../interfaces';
import { UUID } from '../types';

export interface IFriendRequest extends IEntity {
  from: IUser;
  to: IUser;
  status: FriendRequestStatus;
}

export interface ICreateFriendRequestDto {
  to: UUID;
}
