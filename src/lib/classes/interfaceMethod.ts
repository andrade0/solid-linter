import {InterfaceMethodParameter} from "./interfaceMethodParameter";

export class InterfaceMethod {
  name: string = '';
  type: string = '';
  isConstructor: boolean = false;
  parameters: InterfaceMethodParameter[] = [];
  genericTypes: string[] = [];
}
