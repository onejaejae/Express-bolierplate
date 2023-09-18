import { IUser } from "../user";

export interface IJwtLoginResponse {
  accessToken: string;
  refreshToken: IUser["refreshToken"];
}

export interface IRefreshTokenResponse extends IJwtLoginResponse {}
