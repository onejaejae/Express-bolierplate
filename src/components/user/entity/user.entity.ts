import { Exclude, Type } from "class-transformer";
import {
  IJoinedPost,
  IUser,
  IUserJoinWithPost,
  RoleType,
} from "../../../types/user";
import { BaseEntity } from "../../database/base.entity";
import { Bcrypt } from "../../../common/util/encrypt";
import { Post } from "../../post/entity/post.entity";

export class User extends BaseEntity implements IUser {
  email: string;

  @Exclude()
  password: string;

  refreshToken: string;

  role: RoleType;

  constructor(email: string, password: string, role: RoleType) {
    super();
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export class JoinedPost implements IJoinedPost {
  postTitle: string;
  postContent: string;
  postId: number;
}

export class UserJoinWithPost extends User {
  @Type(() => Post)
  posts: Post[];
}

export class GenerateUserJoinWithPost extends User {
  postId: number;
  postTitle: string;
  postContent: string;

  generatePost() {
    const post: IJoinedPost = {
      postId: this.postId,
      postTitle: this.postTitle,
      postContent: this.postContent,
    };
    return post;
  }

  generateUser() {
    const user: IUserJoinWithPost = {
      id: this.id,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      refreshToken: this.refreshToken,
      posts: [],
    };
    return user;
  }
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
}
