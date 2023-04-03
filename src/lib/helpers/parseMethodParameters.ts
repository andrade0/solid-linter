import {parseNameOjbect} from "./parseNameOjbect";
import {parseType2} from "./parseType2";
import {Parameter} from "../classes/parameter.class";
import * as ts from "typescript";
import {parseModifier} from "./parseModifier";
import {parseIsInjectedObject} from "./parseIsInjectedObject";
import {parseGenericTypes} from "./parseGenericTypes";

export const parseMethodParameters = (className: string, methodName: string, parameters: any, methodGenericTypes: string[]): Parameter[] => {
  const parsedParameters: Parameter[] = [];
  parameters.forEach((parameter: any) => {
    const param: Parameter = new Parameter();
    if(parameter.name !== undefined) {
      param.name = parseNameOjbect(parameter.name);
    }
    if(parameter.type) {
      param.type = parseType2(parameter.type);
    }

    if(parameter.initializer) {
      param.defaultValue = parameter.initializer.text;
      if(ts.SyntaxKind[parameter.initializer.kind] === "NewExpression") {
        param.defaultValueIsNewInstanceOfObject = true;
      }
    }

    if(parameter.modifiers && parameter.modifiers.length > 0) {
      param.modifiers = parseModifier(parameter.modifiers);
      param.isInjectedObject = parseIsInjectedObject(parameter.modifiers);
    }

    if(methodGenericTypes.includes(param.type.replace('[]', ''))) {
      param.isGeneric = true;
    }

    if(parameter.type && parameter.type.kind) {
      param.isArray = ts.SyntaxKind[parameter.type.kind] === 'ArrayType';
    }

    parsedParameters.push(param);
  });
  return parsedParameters;
}
