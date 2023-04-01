import * as ts from "typescript";
import {ClassITem} from "./classITem.class";


export class ClassProperty extends ClassITem {
  // decorators: Decorateur[];

  isInjectedObject?: boolean = false;

  defaultValue?: string;
  defaultValueIsNewInstanceOfObject?: boolean;

  tsObject?: ts.PropertyDeclaration;

  constructor() {
    super();
    // this.decorators = [];
  }
}
