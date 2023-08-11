export interface IWrite<T> {
  create(item: T): Promise<boolean>;
  update(item: T): Promise<boolean>;
  softDelete(id: number): Promise<boolean>;
}
