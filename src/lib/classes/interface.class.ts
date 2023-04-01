import {InterfaceDeclarationWithSourceFile, safeStringify} from "../helpers";
import * as ts from "typescript";
import {parseType2} from "../helpers/parseType2";
import {parseNameOjbect} from "../helpers/parseNameOjbect";
import {InterfaceProperty} from "./interfaceProperty";
import {InterfaceMethod} from "./interfaceMethod";
import {parseGenericTypes} from "../helpers/parseGenericTypes";
import {parseInterfaceMethodParameters} from "../helpers/parseInterfaceMethodParameters";
import {parseExtends} from "../helpers/parseExtends";

export class InterfaceClass {
  sourceFile: ts.SourceFile;
  interfaceDeclaration: ts.InterfaceDeclaration;
  parsedObject: any;
  extendsObj: InterfaceClass[] = [];
  constructor(data: InterfaceDeclarationWithSourceFile) {
    this.sourceFile = data.sourceFile;
    this.interfaceDeclaration = data.interfaceDeclaration;
    this.parsedObject = JSON.parse(safeStringify(data.interfaceDeclaration));
  }

  get properties(): InterfaceProperty[] {
    const properties: InterfaceProperty[] = [];
    if (this.parsedObject.members) {
      this.parsedObject.members.forEach((member: any) => {
        if(ts.SyntaxKind[member.kind] === "PropertySignature") {
          const interfaceProperty: InterfaceProperty = new InterfaceProperty();
          if(member.name !== undefined) {
            interfaceProperty.name = parseNameOjbect(member.name);
          }
          if(member.type) {
            interfaceProperty.type = parseType2(member.type);
          }
          properties.push(interfaceProperty);
        }
      });
    }
    return properties;
  }

  get extends(): string[] {
    const extendsArray: string[] = [];
    if(this.parsedObject.heritageClauses && this.parsedObject.heritageClauses.length > 0) {
      return parseExtends(this.parsedObject.heritageClauses);
    }
    return extendsArray;
  }

  get methods(): InterfaceMethod[] {
    const methods: InterfaceMethod[] = [];
    if (this.parsedObject.members) {
      this.parsedObject.members.forEach((method: any) => {
        if(ts.SyntaxKind[method.kind] === "MethodSignature") {
          const interfaceMethod: InterfaceMethod = new InterfaceMethod();
          if(method.name !== undefined) {
            interfaceMethod.name = parseNameOjbect(method.name);
          }
          if(method.type) {
            interfaceMethod.type = parseType2(method.type);
          }
          if(method.typeParameters) {
            interfaceMethod.genericTypes = parseGenericTypes(method.typeParameters);
          } else {
            interfaceMethod.genericTypes = [];
          }
          if(method.parameters) {
            interfaceMethod.parameters = parseInterfaceMethodParameters(method.parameters, interfaceMethod.genericTypes);
          }
          methods.push(interfaceMethod);
        }
      });
    }
    return methods;
  }

  get genericTypes(): string[] {
    if (this.parsedObject.typeParameters && this.parsedObject.typeParameters.length > 0) {
      return parseGenericTypes(this.parsedObject.typeParameters);
    }
    return [];
  }

  get name(): string {
    if(this.parsedObject && this.parsedObject.name && this.parsedObject.name.escapedText) {
      return this.parsedObject.name.escapedText;
    }
    return '';
  }

  get fileUri(): string {
    return this.sourceFile.fileName;
  }
}
