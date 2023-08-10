import { compare, hash } from "bcrypt";

export const createHash = async (value: string): Promise<string> => {
  const saltOrRounds = 10;
  return await hash(value, saltOrRounds);
};

export const isSameAsHash = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(plainPassword, hashedPassword);
};
