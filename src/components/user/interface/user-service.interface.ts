import { IGetUserResponse } from "../../../types/user";

export interface IUserService {
  getUser(uesrId: number): Promise<IGetUserResponse>;
}
