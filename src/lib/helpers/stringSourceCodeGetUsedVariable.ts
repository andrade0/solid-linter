import ts from "typescript";
import {variablesNamesOnSwitchOrIf} from "../types/variablesNamesOnSwitchOrIf";

function visitNode(node: ts.Node, variableNames: Set<string>): void {
  if (ts.isIdentifier(node)) {
    variableNames.add(node.getText());
  }

  ts.forEachChild(node, (child) => visitNode(child, variableNames));
}

function extractVariableNamesUsed(sourceCode: string): string[] {
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const variableNames: Set<string> = new Set();
  visitNode(sourceFile, variableNames);

  return Array.from(variableNames);
}

export const stringSourceCodeGetUsedVariable = (statementType: 'IF' | 'SWITCH', sourceCode: string): variablesNamesOnSwitchOrIf[] => {
  return extractVariableNamesUsed(sourceCode).map((variableName: string) => {
    return {
      variableName,
      ifOrSwitch: statementType
    };
  });
}
