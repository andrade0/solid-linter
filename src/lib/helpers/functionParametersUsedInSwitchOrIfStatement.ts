import {variablesNamesOnSwitchOrIf} from "../types/variablesNamesOnSwitchOrIf";
import * as ts from "typescript";
import fs from "fs";
import {FunctionInfo} from "./parseFunctions";
import {stringSourceCodeGetUsedVariable} from "./stringSourceCodeGetUsedVariable";

export const functionParametersUsedInSwitchOrIfStatement = (_function: FunctionInfo): variablesNamesOnSwitchOrIf[] => {
  const methodParametersNames = _function.parameters;
  const candidateVariables = [...methodParametersNames];
  const sourceFile = ts.createSourceFile('sample.ts', fs.readFileSync(_function.sourceFile.fileName, {encoding: "utf-8"}), ts.ScriptTarget.Latest, true);
  let variablesUsedInSwitchOrIf: variablesNamesOnSwitchOrIf[] = findTestedVariableInIfElseOrSwitch(sourceFile, _function.name);
  return variablesUsedInSwitchOrIf.filter((item: variablesNamesOnSwitchOrIf) => candidateVariables.includes(item.variableName));
}

export const findTestedVariableInIfElseOrSwitch = (
  sourceFile: ts.SourceFile,
  functionName: string
): variablesNamesOnSwitchOrIf[] => {
  let testedVariables: variablesNamesOnSwitchOrIf[] = [];

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === functionName && node.body !== undefined) {

        ts.forEachChild(node.body, function visitMethodChild(methodChildNode: ts.Node) {
          if (ts.isIfStatement(methodChildNode) || ts.isSwitchStatement(methodChildNode)) {
            const expression = methodChildNode.expression;
            let statementType: 'IF' | 'SWITCH' = 'IF';
            if(ts.isIfStatement(methodChildNode)) {
              statementType = 'IF';
            } else if(ts.isSwitchStatement(methodChildNode)) {
              statementType = 'SWITCH';
            }
            if(expression !== undefined && expression.getText() !== undefined){
              testedVariables = [...testedVariables, ...stringSourceCodeGetUsedVariable(statementType, expression.getText())];
            }
          }
          ts.forEachChild(methodChildNode, visitMethodChild);
        });

    } else {
      ts.forEachChild(node, visit);
    }
  }

  visit(sourceFile);
  return testedVariables;
}
