import { BaseEntity } from "../../database/base.entity";

export class Post extends BaseEntity {
  authorId: number;
  title: string;
  content: string;

  constructor(authorId: number, title: string, content: string) {
    super();
    this.authorId = authorId;
    this.title = title;
    this.content = content;
  }
}
