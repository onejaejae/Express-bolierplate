export interface IWrite<T> {
  create(item: T): Promise<boolean>;
  update(item: T): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
