import { ClassConstructor } from "class-transformer";

export abstract class ExecutionContext<T> {
  constructor(private readonly classType: ClassConstructor<T>) {}

  getClass() {
    return this.classType.name;
  }
}
