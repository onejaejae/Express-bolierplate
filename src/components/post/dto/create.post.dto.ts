import { IsNumber, IsString } from "class-validator";

export class CreatePostDto {
  @IsNumber()
  readonly authorId: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;
}
