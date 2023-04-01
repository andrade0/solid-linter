import * as ts from "typescript";

export type InterfaceDeclarationWithSourceFile = {
  sourceFile: ts.SourceFile,
  interfaceDeclaration: ts.InterfaceDeclaration
}

export const getInterfaceDeclarationsFromSourceFileObject = (sourceFile: ts.SourceFile): InterfaceDeclarationWithSourceFile[] => {
  const interfaces: InterfaceDeclarationWithSourceFile[] = [];
  ts.forEachChild(sourceFile, node => {
    if (ts.isInterfaceDeclaration(node)) {
      interfaces.push({interfaceDeclaration: node, sourceFile});
    }
  });
  return interfaces;
}
