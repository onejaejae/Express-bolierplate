import { Enum, EnumType } from "ts-jenum";

@Enum("role")
export class Role extends EnumType<Role>() {
  static readonly ADMIN = new Role(0, "ADMIN", "관리자");
  static readonly MEMBER = new Role(1, "MEMBER", "멤버");

  private constructor(
    readonly code: number,
    readonly role: string,
    readonly name: string
  ) {
    super();
  }

  isLeader(): boolean {
    return this.code < Role.MEMBER.code;
  }

  isEquals(role: Role): boolean {
    return this.code === role.code;
  }
}
