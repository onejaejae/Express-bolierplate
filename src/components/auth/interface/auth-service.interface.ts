import { IJwtLoginResponse, IRefreshTokenResponse } from "../../../types/auth";
import { LoginDto } from "../dto/login.dto";
import { RefreshTokenDto } from "../dto/refresh.dto";
import { SignUpDto } from "../dto/signUp.dto";

export interface IAuthService {
  signUp(signUpDto: SignUpDto): Promise<boolean>;
  refresh(refreshTokenDto: RefreshTokenDto): Promise<IRefreshTokenResponse>;
  jwtLogin(loginDTO: LoginDto): Promise<IJwtLoginResponse>;
}
