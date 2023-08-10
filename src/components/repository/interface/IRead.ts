export interface IRead<T> {
  find(item: T): Promise<T[]>;
  findByIdOrThrow(id: number): Promise<T>;
}
