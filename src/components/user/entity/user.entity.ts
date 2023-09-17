import { Exclude, Type } from "class-transformer";
import { IUserJoinWithPost, RoleType } from "../../../types/user";
import { BaseEntity } from "../../database/base.entity";
import { Post } from "../../post/entity/post.entity";
import { Bcrypt } from "../../../common/util/encrypt";

export class User extends BaseEntity {
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  role: RoleType;

  constructor(email: string, password: string, role: RoleType) {
    super();
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export class UserWithoutPassword extends BaseEntity {
  email: string;
  role: RoleType;

  constructor(email: string, role: RoleType) {
    super();
    this.email = email;
    this.role = role;
  }
}

export class UserJoinWithPost
  extends UserWithoutPassword
  implements IUserJoinWithPost
{
  @Type(() => Post)
  posts: Post[];
}

export class UserWithPassword extends BaseEntity {
  password: string;
  email: string;
  role: RoleType;

  @Exclude()
  refreshToken: string;

  isPasswordValid(inputPwd: string, bcrypt: Bcrypt) {
    return bcrypt.isSameAsHash(inputPwd, this.password);
  }

  hashedPassword(password: string, bcrypt: Bcrypt) {
    return bcrypt.createHash(password);
  }
}
