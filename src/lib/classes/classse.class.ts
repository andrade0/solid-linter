import * as ts from "typescript";
import {ClassDeclarationWithSourceFile, debugJson, safeStringify, stringSourceCodeGetUsedVariable} from "../helpers";
import {parseNameOjbect} from "../helpers/parseNameOjbect";
import {parseReturnType, parseType2} from "../helpers/parseType2";
import {InterfaceMethod} from "./interfaceMethod";
import {parseGenericTypes} from "../helpers/parseGenericTypes";
import {ClassProperty} from "./classProperty.class";
import {parseExtends} from "../helpers/parseExtends";
import {parseImplements} from "../helpers/parseImplements";
import {parseModifier} from "../helpers/parseModifier";
import {parseIsInjectedObject} from "../helpers/parseIsInjectedObject";
import {parseMethodParameters} from "../helpers/parseMethodParameters";
import {Parameter} from "./parameter.class";
import fs from "fs";
import {ClasseMethod} from "./ClasseMethod";
import {InterfaceClass} from "./interface.class";
import {variablesNamesOnSwitchOrIf} from "../types/variablesNamesOnSwitchOrIf";
import {variableNameAndType} from "../types/variableNameAndType";
import {ClassMethod} from "./classMethod.class";

export class Classse {
  sourceFile: ts.SourceFile;
  classDeclaration: ts.ClassDeclaration;
  parsedObject: any;
  extendsObj: Classse[] = [];
  implementsObj: InterfaceClass[] = [];
  classesNames: string[];
  interfacesNames: string[];

  constructor(data: ClassDeclarationWithSourceFile, classesNames: string[], interfacesNames: string[]) {
    this.classesNames = classesNames;
    this.interfacesNames = interfacesNames;
    this.sourceFile = data.sourceFile;
    this.classDeclaration = data.classDeclaration;
    this.parsedObject = JSON.parse(safeStringify(data.classDeclaration));
  }

  get modifiers(): string[] {
    return parseModifier(this.parsedObject.modifiers);
  }

  get properties(): ClassProperty[] {
    const properties: ClassProperty[] = [];
    if (this.parsedObject.members) {
      this.parsedObject.members.forEach((property: any) => {
        const kind = ts.SyntaxKind[property.kind];
        let initializerKind = undefined;
        if (property.initializer && property.initializer.kind) {
          initializerKind = ts.SyntaxKind[property.initializer.kind];
        }
        if (kind === "PropertyDeclaration" && initializerKind !== "ArrowFunction" && initializerKind !== "FunctionExpression") {
          const newProperty: ClassProperty = new ClassProperty();
          if (property.name !== undefined) {
            newProperty.name = parseNameOjbect(property.name);
          }
          if (property.type) {
            newProperty.type = parseType2(property.type);
          }

          if (initializerKind === 'FirstLiteralToken' && property.initializer.text) {
            newProperty.defaultValue = property.initializer.text;
          }

          if (newProperty.defaultValue === undefined && property.initializer && property.initializer.text) {
            newProperty.defaultValue = property.initializer.text;
          }

          if (initializerKind === 'NewExpression') {
            if (property.initializer && property.initializer.expression && property.initializer.expression.escapedText) {
              newProperty.defaultValue = property.initializer.expression.escapedText;
              newProperty.defaultValueIsNewInstanceOfObject = true;
            }
          }
          if (property.modifiers && property.modifiers.length > 0) {
            newProperty.modifiers = parseModifier(property.modifiers);
            newProperty.isInjectedObject = parseIsInjectedObject(property.modifiers);
          } else if(this.classesNames.includes(newProperty.type) || this.interfacesNames.includes(newProperty.type)) {
            newProperty.isInjectedObject = true;
          }

          properties.push(newProperty);
        }
      });
    }

    let constructor: ClasseMethod | undefined = this.methods.find((method: ClasseMethod) => {
      return method.name === "constructor";
    });

    let propertiesFromConstructor: Parameter[] = [];
    if(constructor !== undefined) {
      propertiesFromConstructor = constructor.parameters.filter((parameter: any) => parameter.modifiers.length > 0);
    }

    if (propertiesFromConstructor && propertiesFromConstructor.length > 0) {
      propertiesFromConstructor.forEach((parameter: Parameter) => {
        const _newProperty: ClassProperty = new ClassProperty();
        _newProperty.name = parameter.name;
        _newProperty.type = parameter.type;
        _newProperty.modifiers = parameter.modifiers;
        if(this.classesNames.includes(_newProperty.type) || this.interfacesNames.includes(_newProperty.type)) {
          _newProperty.isInjectedObject = true;
        } else {
          _newProperty.isInjectedObject = parameter.isInjectedObject;
        }
        if (parameter.defaultValue) {
          _newProperty.defaultValue = parameter.defaultValue;
          if (parameter.defaultValueIsNewInstanceOfObject) {
            _newProperty.defaultValueIsNewInstanceOfObject = true;
          }
        }
        properties.push(_newProperty);
      });
    }

    return properties;
  }

  get extends(): string[] {
    const extendsArray: string[] = [];
    if (this.parsedObject.heritageClauses && this.parsedObject.heritageClauses.length > 0) {
      return parseExtends(this.parsedObject.heritageClauses);
    }
    return extendsArray;
  }

  get implements(): string[] {
    const extendsArray: string[] = [];
    if (this.parsedObject.heritageClauses && this.parsedObject.heritageClauses.length > 0) {
      return parseImplements(this.parsedObject.heritageClauses);
    }
    return extendsArray;
  }

  get methods(): ClasseMethod[] {
    const methods: ClasseMethod[] = [];
    if (this.parsedObject.members) {
      this.parsedObject.members.forEach((method: any) => {



        const kind = ts.SyntaxKind[method.kind];
        let initializerKind = undefined;
        if (method.initializer && method.initializer.kind) {
          initializerKind = ts.SyntaxKind[method.initializer.kind];
        }

        if (kind === "GetAccessor" || kind === "Constructor" || kind === "MethodDeclaration" || (kind === "PropertyDeclaration" && (initializerKind === "ArrowFunction" || initializerKind === "FunctionExpression"))) {
          const newMethod: ClasseMethod = new ClasseMethod();
          if (method.name !== undefined) {
            newMethod.name = parseNameOjbect(method.name);
          }

          if (kind === "Constructor") {
            newMethod.name = 'constructor';
            newMethod.isConstructor = true;
          }

          if (method.typeParameters) {
            newMethod.genericTypes = parseGenericTypes(method.typeParameters);
          } else {
            newMethod.genericTypes = [];
          }

          if (method.type) {
            newMethod.type = parseReturnType(this.name, newMethod.name, method.type, [...newMethod.genericTypes, ...this.genericTypes]);
          }

          if (method.parameters) {
            newMethod.parameters = parseMethodParameters(this.name, newMethod.name, method.parameters, [...newMethod.genericTypes, ...this.genericTypes]);
          }

          methods.push(newMethod);
        }
      });
    }
    return methods;
  }

  classesInstanciedInMethodWithNewKeyword(methodName: string, classNamesList: string[]): variableNameAndType[] {
    const sourceFile = ts.createSourceFile('sample.ts', fs.readFileSync(this.fileUri, {encoding: "utf-8"}), ts.ScriptTarget.Latest, true);
    let newIntanciedTypes: string[] = [];
    const method: ClasseMethod | undefined = this.methods.find((method: ClasseMethod) => method.name === methodName);
    if(method !== undefined) {
      const newInstanceTypes = this.findNewInstanceTypes(sourceFile, this.name, methodName);
      newInstanceTypes.forEach((type: ts.Identifier) => {
        newIntanciedTypes.push(type.text);
      });
    }

    return newIntanciedTypes.filter((type: string) => {
      return classNamesList.includes(type);
    }).reduce((memo: variableNameAndType[], type: string) => {
      const existingProperty: ClassProperty | undefined = this.properties.find((property: ClassProperty) => {
        return property.type === type;
      });
      if(existingProperty !== undefined) {
        memo.push({
          variableName: existingProperty.name,
          type: type
        });
      }
      return memo;
    }, []);
  }

  methodParametersOrClassPropertiesUsedInSwitchOrIfStatement(methodName: string): variablesNamesOnSwitchOrIf[] {
    const method: ClasseMethod | undefined = this.methods.find((method: ClasseMethod) => method.name === methodName);
    if(method !== undefined) {
      // const classPropertiesNames = this.properties.map((property: ClassProperty) => property.name);
      const classPropertiesNames: string[] = [];
      const methodParametersNames = method.parameters.map((parameter: Parameter) => parameter.name);
      const candidateVariables = [...classPropertiesNames, ...methodParametersNames];
      const sourceFile = ts.createSourceFile('sample.ts', fs.readFileSync(this.fileUri, {encoding: "utf-8"}), ts.ScriptTarget.Latest, true);
      let variablesUsedInSwitchOrIf: variablesNamesOnSwitchOrIf[] = this.findTestedVariableInIfElseOrSwitch(sourceFile, this.name, methodName);
      return variablesUsedInSwitchOrIf.filter((item: variablesNamesOnSwitchOrIf) => candidateVariables.includes(item.variableName));
    }
    return [];
  }

  get genericTypes(): string[] {
    if (this.parsedObject.typeParameters && this.parsedObject.typeParameters.length > 0) {
      return parseGenericTypes(this.parsedObject.typeParameters);
    }
    return [];
  }

  get name(): string {
    if (this.parsedObject && this.parsedObject.name && this.parsedObject.name.escapedText) {
      return this.parsedObject.name.escapedText;
    }
    return '';
  }

  get injecteds(): string[] {
    const injectedClasses: string[] = [];
    this.properties.forEach((property: ClassProperty) => {
      if (property.isInjectedObject) {
        injectedClasses.push(property.type);
      }
    });
    return Array.from(new Set(injectedClasses));
  }

  get fileUri(): string {
    return this.sourceFile.fileName;
  }

  findMethodVariables(
    sourceFile: ts.SourceFile,
    className: string,
    methodName: string
  ): ts.VariableDeclaration[] {
    const variableDeclarations: ts.VariableDeclaration[] = [];

    function visit(node: ts.Node) {
      if (ts.isClassDeclaration(node) && node.name?.text === className) {
        for (const member of node.members) {
          if (ts.isMethodDeclaration(member) && (member.name as ts.Identifier).text === methodName) {

            if(member.body !== undefined) {
              ts.forEachChild(member.body, function visitMethodChild(methodChildNode) {
                if (ts.isVariableStatement(methodChildNode)) {
                  methodChildNode.declarationList.declarations.forEach(declaration => {
                    variableDeclarations.push(declaration);
                  });
                }
                ts.forEachChild(methodChildNode, visitMethodChild);
              });
            } else {
              // console.log('Method body is undefined');
            }
          }
        }
      } else {
        ts.forEachChild(node, visit);
      }
    }

    visit(sourceFile);
    return variableDeclarations;
  }

  findSwitchOrIfStatements(sourceFile: ts.SourceFile, className: string): ts.Node[] {
    const foundStatements: ts.Node[] = [];

    function visit(node: ts.Node) {
      if (ts.isClassDeclaration(node) && node.name?.text === className) {
        node.members.forEach(member => {
          if (ts.isMethodDeclaration(member)) {
            if(member.body !== undefined) {
              ts.forEachChild(member.body, function visitMethodChild(methodChildNode: ts.Node) {
                if (isSwitchOrIfStatement(methodChildNode)) {
                  foundStatements.push(methodChildNode);
                }
                ts.forEachChild(methodChildNode, visitMethodChild);
              });
            } else {
              // console.log('Method body is undefined');
            }
          }
        });
      } else {
        ts.forEachChild(node, visit);
      }
    }

    visit(sourceFile);
    return foundStatements;
  }

  findSwitchStatements(
    sourceFile: ts.SourceFile,
    className: string,
    methodName: string
  ): ts.SwitchStatement[] {
    const switchStatements: ts.SwitchStatement[] = [];

    function visit(node: ts.Node) {
      if (ts.isClassDeclaration(node) && node.name?.text === className) {
        for (const member of node.members) {
          if (ts.isMethodDeclaration(member) && (member.name as ts.Identifier).text === methodName) {

            if(member.body !== undefined) {
              ts.forEachChild(member.body, function visitMethodChild(methodChildNode: ts.Node) {
                if (ts.isSwitchStatement(methodChildNode)) {
                  switchStatements.push(methodChildNode);
                }
                ts.forEachChild(methodChildNode, visitMethodChild);
              });
            } else {
              // console.log('Method body is undefined');
            }
          }
        }
      } else {
        ts.forEachChild(node, visit);
      }
    }

    visit(sourceFile);
    return switchStatements;
  }

  findTestedVariableInIfElseOrSwitch(
    sourceFile: ts.SourceFile,
    className: string,
    methodName: string
  ): variablesNamesOnSwitchOrIf[] {
    let testedVariables: variablesNamesOnSwitchOrIf[] = [];

    function visit(node: ts.Node) {
      if (ts.isClassDeclaration(node) && node.name?.text === className) {
        for (const member of node.members) {
          if ((ts.isMethodDeclaration(member) || ts.isAccessor(member) || ts.isConstructorDeclaration(member)) && (member.name !== undefined && (member.name as ts.Identifier).text === methodName || methodName === 'constructor')) {
            if(member.body !== undefined && ( (member.name?.getText() === methodName) || (methodName === 'constructor' && ts.SyntaxKind[member.kind] === 'Constructor') )) {
              ts.forEachChild(member.body, function visitMethodChild(methodChildNode: ts.Node) {
                if (ts.isIfStatement(methodChildNode) || ts.isSwitchStatement(methodChildNode)) {
                  const expression = methodChildNode.expression;
                  let statementType: 'IF' | 'SWITCH' = 'IF';
                  if(ts.isIfStatement(methodChildNode)) {
                    statementType = 'IF';
                  } else if(ts.isSwitchStatement(methodChildNode)) {
                    statementType = 'SWITCH';
                  }
                  testedVariables = [...testedVariables, ...stringSourceCodeGetUsedVariable(statementType, expression.getText())];
                }
                ts.forEachChild(methodChildNode, visitMethodChild);
              });
            } else {
              // console.log('Method body is undefined');
            }
          }
        }
      } else {
        ts.forEachChild(node, visit);
      }
    }

    visit(sourceFile);
    return testedVariables;
  }

  findNewInstanceTypes(
    sourceFile: ts.SourceFile,
    className: string,
    methodName: string
  ): ts.Identifier[] {
    const newInstanceTypes: ts.Identifier[] = [];

    function visit(node: ts.Node) {
      if (ts.isClassDeclaration(node) && node.name?.text === className) {
        for (const member of node.members) {
          if (ts.isMethodDeclaration(member) && (member.name as ts.Identifier).text === methodName) {

            if(member.body !== undefined) {
              ts.forEachChild(member.body, function visitMethodChild(methodChildNode: ts.Node) {
                if (ts.isNewExpression(methodChildNode)) {
                  const expression = methodChildNode.expression;
                  if (ts.isIdentifier(expression)) {
                    newInstanceTypes.push(expression);
                  }
                }
                ts.forEachChild(methodChildNode, visitMethodChild);
              });
            } else {
              // console.log('Method body is undefined');
            }

          }
        }
      } else {
        ts.forEachChild(node, visit);
      }
    }

    visit(sourceFile);
    return newInstanceTypes;
  }

  methodGetSignature(methodName: string): string {
    const method: ClasseMethod | undefined = this.methods.find(m => m.name === methodName);
    if (method !== undefined) {
      let signature = method.name + '(';
      signature += method.parameters.map((parameter: Parameter) => {
        return parameter.name + ': ' + parameter.type;
      }).join(', ')
      signature += ')';
      if(method.type.toString() !== undefined) {
        signature += ': ' + method.type;
      }
      return signature;
    }
    return '';
  }
}

function isSwitchOrIfStatement(node: ts.Node): boolean {
  return ts.isSwitchStatement(node) || ts.isIfStatement(node);
}
