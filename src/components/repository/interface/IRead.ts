export interface IRead<T> {
  find(item: T): Promise<T[]>;
  findOneAndThrow(id: number): Promise<T>;
}
