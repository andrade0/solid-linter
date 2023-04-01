import * as ts from "typescript";
import {getFilesFromPaths} from "../lib/helpers";

// export const folderPath = '/Users/andrade/Downloads/solid-playground/src'; // replace with the path to the directory where your TypeScript files are located
// export const folderPath = '/Users/andrade/Downloads/dev/oasis-api-copie/src'; // replace with the path to the directory where your TypeScript files are located
export const folderPath = '/Users/andrade/Downloads/domain-driven-hexagon/src'; // replace with the path to the directory where your TypeScript files are located

export const program = ts.createProgram({
  rootNames: getFilesFromPaths(folderPath),
  options: {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    noEmit: true,
  }
});
