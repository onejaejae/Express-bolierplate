export class TokenPayload {
  readonly sub: string;
  readonly email: string;

  constructor(sub: string, email: string) {
    this.sub = sub;
    this.email = email;
  }

  toPlain(): { sub: string; email: string } {
    return {
      sub: this.sub,
      email: this.email,
    };
  }
}
