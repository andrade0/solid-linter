import { Decorateur } from "./decorateur.class";
import * as ts from "typescript";
import { SyntaxKind } from "typescript";

export class Parameter {

  name: string;

  type: string;

  kind?: SyntaxKind | string | undefined;

  value: string;

  defaultValue?: string;
  defaultValueIsNewInstanceOfObject?: boolean;

  isInjectedObject?: boolean = false;

  modifiers: string[];

  isGeneric: boolean = false;
  isArray: boolean = false;

  decorators: Decorateur[];

  tsObject?: ts.ParameterDeclaration;

  constructor() {
    this.name = "";
    this.type = "";
    this.value = ""; // default value
    this.modifiers = [];
    this.decorators = [];
  }
}
