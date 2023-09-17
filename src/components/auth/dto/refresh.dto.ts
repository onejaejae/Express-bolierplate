import { IsNumber, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsNumber()
  userId: number;
}
