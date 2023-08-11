export class CreatePostDTO {
  readonly authorId: number;
  readonly title: string;
  readonly content: string;

  constructor(authorId: number, title: string, content: string) {
    this.authorId = authorId;
    this.title = title;
    this.content = content;
  }
}
