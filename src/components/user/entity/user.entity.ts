import { Exclude } from "class-transformer";
import { IUserJoinWithPost, RoleType } from "../../../types/user";
import { BaseEntity } from "../../database/base.entity";
import { Post } from "../../post/entity/post.entity";

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
  posts: Post[];

  constructor(email: string, role: RoleType) {
    super(email, role);
  }
}
