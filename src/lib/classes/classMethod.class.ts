import * as ts from "typescript";
import {ClassITem} from "./classITem.class";
import {Parameter} from "./parameter.class";
import {Decorateur} from "./decorateur.class";
import {CodeStatement} from "./CodeStatement.class";
import {findNewExpressionsInMethodOrConstructor} from "../helpers";
import {parseType} from "../helpers/parseType";

export class ClassMethod extends ClassITem {
  parameters: Parameter[];

  decorators: Decorateur[];

  _class: ts.ClassDeclaration = {} as ts.ClassDeclaration;

  genericTypes?: string[] = [];

  isConstructor: boolean;

  returnType: undefined | string;

  tsObject?: ts.MethodDeclaration;
  classObject?: ts.ClassDeclaration;

  statements: CodeStatement[] = [];

  constructor() {
    super();
    this.parameters = [];
    this.decorators = [];
    this.isConstructor = false;
  }

  containsNewIntanceOfOtherClass(existingClassesArray: string[] = []): string[] {
    if(this.classObject !== undefined && this.tsObject !== undefined) {
      return findNewExpressionsInMethodOrConstructor(this.classObject, this.tsObject, existingClassesArray);
    } else {
      return [];
    }
  }

  get key(): string {


    const parametersString = this.parameters.map((p: Parameter) => {
      if(p.name === 'object' && p.type.trim().length === 1) {
        return `<GENERIC>`;
      } else {
        return p.type;
      }
      return true;
    });

    return `${this.name}(${parametersString})${this.modifiers.length > 0 ? ` ${this.modifiers.join(',')}` : ''}${this.returnType ? `: ${this.returnType}` : ''}`;
    // return `${this.name}${this.modifiers.length > 0 ? ` ${this.modifiers.join(',')}` : ''}${this.returnType ? `: ${this.returnType}` : ''}`; // todo: handle method parameters for genreating types
  }

  get _parameters(): Parameter[] {

    if(this.tsObject === undefined) {
      return [];
    }

    const parametersOutput: Parameter[] = [];
    this.tsObject.parameters.forEach((methodParameter: any) => {

      // console.log(methodParameter);

      //parseGenericTypes(this.tsObject.typeParameters);
      //parseGenericTypes(this._class.typeParameters);
      // console.log('GENERIC', parseGenericTypes(this.tsObject.typeParameters), parseGenericTypes(this._class.typeParameters));

      const argumentKind = ts.SyntaxKind[methodParameter.kind];

      if(argumentKind === "Parameter") {

        const parameter = new Parameter();

        parameter.tsObject = methodParameter as ts.ParameterDeclaration;

        parameter.kind = argumentKind;

        if(methodParameter.name && methodParameter.name.escapedText) {
          const parameterName = methodParameter.name.escapedText;
          parameter.name = parameterName;

        }

        if(methodParameter.initializer && methodParameter.initializer.text) {
          const defaultValue = methodParameter.initializer.text;
          parameter.value = defaultValue;
        }

        if(methodParameter.type && methodParameter.type.kind && ts.SyntaxKind[methodParameter.type.kind] !== undefined){
          const type = parseType(methodParameter.type);
          //console.log(methodParameter);
          //console.log(type);
          // console.log({type});
          // const type = ts.SyntaxKind[methodParameter.type.kind];
          if (type === "StringKeyword") {
            parameter.type = "string";
          } else if (type === "NumberKeyword") {
            parameter.type = "number";
          } else if (type === "BooleanKeyword") {
            parameter.type = "boolean";
          } else if (type === "AnyKeyword") {
            parameter.type = "any";
          } else if (type === "VoidKeyword") {
            parameter.type = "void";
          } else if (type === "NullKeyword") {
            parameter.type = "null";
          } else if (type === "UndefinedKeyword") {
            parameter.type = "undefined";
          } else if (type === "NeverKeyword") {
            parameter.type = "never";
          } else if (type === "ObjectKeyword") {
            parameter.type = "object";
          } else if (type === "ArrayKeyword") {
            parameter.type = "array";
          } else if (type === "TupleKeyword") {
            parameter.type = "tuple";
          } else if (type === "UnionKeyword") {
            parameter.type = "union";
          } else if (type === "IntersectionKeyword") {
            parameter.type = "intersection";
          } else if (type === "ConditionalKeyword") {
            parameter.type = "conditional";
          } else if (type === "InferKeyword") {
            parameter.type = "infer";
          } else if (type === "ParenthesizedKeyword") {
            parameter.type = "parenthesized";
          } else if (type === "DateKeyword") {
            parameter.type = "Date";
          } else if (type === "RegExpKeyword") {
            parameter.type = "RegExp";
          } else {
            parameter.type = type;
          }
        } else {

        }
        parametersOutput.push(parameter);
      }
    });
    return parametersOutput;
  }
}
