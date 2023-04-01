import * as ts from "typescript";

export type ClassDeclarationWithSourceFile = {
  sourceFile: ts.SourceFile,
  classDeclaration: ts.ClassDeclaration
}

export const getClassesDeclarationsFromSourceFileObject = (sourceFile: ts.SourceFile): ClassDeclarationWithSourceFile[] => {
  const classes: ClassDeclarationWithSourceFile[] = [];
  ts.forEachChild(sourceFile, node => {
    if (ts.isClassDeclaration(node)) {
      classes.push({classDeclaration: node, sourceFile});
    }
  });
  return classes;
}
