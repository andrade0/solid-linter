import {Parameter} from "./parameter.class";
import {ReturnType} from "./returnType.class";

export class ClasseMethod {
  name: string = '';
  type: ReturnType = new ReturnType();
  isConstructor: boolean = false;
  parameters: Parameter[] = [];
  genericTypes: string[] = [];
}
