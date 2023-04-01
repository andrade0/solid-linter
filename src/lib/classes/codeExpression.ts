import {SyntaxKind} from "typescript";
import * as ts from "typescript";

export class CodeExpression {
  kind?: SyntaxKind | string | undefined = undefined;
  tsObject?: ts.Expression;
  left?: string = "";
  right?: string = "";
  operator?: string = "";
  value?: any = "";
}
