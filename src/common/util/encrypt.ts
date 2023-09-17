import { compare, hash } from "bcrypt";
import { Service } from "typedi";

@Service()
export class Bcrypt {
  async createHash(value: string): Promise<string> {
    const saltOrRounds = 10;
    return await hash(value, saltOrRounds);
  }

  async isSameAsHash(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(plainPassword, hashedPassword);
  }
}
