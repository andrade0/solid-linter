import {SourceFile as SourceFileType} from "typescript";
// import {folderPath, program} from "../../constants";
import {
  ClassDeclarationWithSourceFile,
  getClassesDeclarationsFromSourceFileObject, getFilesFromPaths,
  getInterfaceDeclarationsFromSourceFileObject, InterfaceDeclarationWithSourceFile
} from "./index";
import {FunctionInfo, parseFunctions} from "./parseFunctions";
import * as ts from "typescript";

export const getAllClassesAndInterfacesAndFunctions = (folderPath: string): {interfaces: InterfaceDeclarationWithSourceFile[], classes: ClassDeclarationWithSourceFile[], functions: FunctionInfo[]} => {

  const program = ts.createProgram({
    rootNames: getFilesFromPaths(folderPath),
    options: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      noEmit: true,
    }
  })

  const classes: ClassDeclarationWithSourceFile[] = [];
  const interfaces: InterfaceDeclarationWithSourceFile[] = [];
  let functions: FunctionInfo[] = [];
  const sourceFiles: any = program.getSourceFiles();
  for (const sourceFile of sourceFiles) {
    if (!sourceFile.isDeclarationFile) {
      const newFunctions: FunctionInfo[] = parseFunctions(sourceFile);
      functions = [...functions, ...newFunctions];
      const _classes: ClassDeclarationWithSourceFile[] = getClassesDeclarationsFromSourceFileObject(sourceFile as SourceFileType);
      for (const _class of _classes) {
        if(_class !== undefined && _class.classDeclaration.name !== undefined) {
          classes.push(_class);
        }
      }
      const _interfaces: InterfaceDeclarationWithSourceFile[] = getInterfaceDeclarationsFromSourceFileObject(sourceFile as SourceFileType);
      for (const _interface of _interfaces) {
        if(_interface !== undefined && _interface.interfaceDeclaration.name !== undefined) {
          interfaces.push(_interface);
        }
      }
    }
  }
  return {interfaces: interfaces, classes: classes, functions};
}
