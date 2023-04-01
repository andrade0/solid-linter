import * as ts from "typescript";
import {Parameter} from "./parameter.class";
import {SyntaxKind} from "typescript";

export class Decorateur {
  parameters: Parameter[];

  name: string;

  kind?: SyntaxKind | string | undefined;

  tsObject?: ts.Decorator;

  constructor() {
    this.parameters = [];
    this.name = "";
  }
}
