import {SyntaxKind} from "typescript";
import * as ts from "typescript";
import {CodeExpression} from "./codeExpression";

export class CodeStatement {
  kind?: SyntaxKind | string | undefined = undefined;
  tsObject?: ts.Statement;
  expression?: CodeExpression;
  isthenStatement: boolean = false;
  statements: CodeStatement[] = [];
  name: string = '';
  arguments: string[] = [];
  type: string = '';
  value: string = '';
  get code(): string {
    if(arguments.length > 0) {
      return `${this.type} ${this.name} ${this.value}(${this.arguments.join(',')})`.replace('  ', ' ');
    } else {
      return `${this.type} ${this.name} ${this.value} ${this.arguments.join(',')}`.replace('  ', ' ');
    }
  }
}
