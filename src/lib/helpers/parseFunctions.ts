import * as ts from "typescript";
import {safeStringify} from "./safeStringify";
import {parseType} from "./parseType";
import {parseStatements} from "./parseStatements";
import {CodeStatement} from "../classes/CodeStatement.class";

export type FunctionInfo = {
  name: string;
  parameters: string[];
  returnType: string;
  typeParameters: string[];
  bodyStatements: CodeStatement[];
  tsObject?: ts.FunctionDeclaration;
  sourceFile: ts.SourceFile;
}

export const parseFunctions = (sourceFile: ts.SourceFile): FunctionInfo[] => {
  const functions: ts.FunctionDeclaration[] = [];

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node)) {
      functions.push(node);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return functions.map((fn: ts.FunctionDeclaration) => {
    return getFunctionInfo(fn, sourceFile);
  });
}

export const getFunctionInfo = (fn: ts.FunctionDeclaration, sourceFile: ts.SourceFile ): FunctionInfo => {
  const fnObj = JSON.parse(safeStringify(fn));

  let parameters: string[] = [];
  let returnType = '';
  let typeParameters: string[] = [];
  const name = fnObj.name && fnObj.name.escapedText ? fnObj.name.escapedText : 'anonymous';
  if(fnObj.parameters !== undefined) {
    parameters = fnObj.parameters.map((param: any) => {
      return param.name.escapedText;
    });
  }
  returnType = fnObj.type ? parseType(fnObj.type) : 'void';
  if(fnObj.typeParameters !== undefined) {
    typeParameters = fnObj.typeParameters.map((typeParametersObj: any) => {
      if(typeParametersObj.name && typeParametersObj.name.escapedText) {
        return typeParametersObj.name.escapedText;
      }
    });
  }


  const statements: CodeStatement[] = parseStatements(fnObj.body.statements);


  return { name, parameters, returnType, tsObject: fn, typeParameters, bodyStatements: statements, sourceFile } as FunctionInfo;
  // return { name, parameters, returnType, typeParameters, bodyStatements: statements };
}
