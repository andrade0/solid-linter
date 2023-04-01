import {Parameter} from "./parameter.class";

export class ClasseMethod {
  name: string = '';
  type: string = '';
  isConstructor: boolean = false;
  parameters: Parameter[] = [];
  genericTypes: string[] = [];
}
