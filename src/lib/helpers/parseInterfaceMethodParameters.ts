import {parseNameOjbect} from "./parseNameOjbect";
import {parseType2} from "./parseType2";
import {InterfaceMethodParameter} from "../classes/interfaceMethodParameter";

export const parseInterfaceMethodParameters = (parameters: any, methodGenericTypes: string[]): InterfaceMethodParameter[] => {
  const parsedParameters: InterfaceMethodParameter[] = [];
  parameters.forEach((parameter: any) => {
    const param: InterfaceMethodParameter = new InterfaceMethodParameter();
    if(parameter.name !== undefined) {
      param.name = parseNameOjbect(parameter.name);
    }
    if(parameter.type) {
      param.type = parseType2(parameter.type);
    }

    if(methodGenericTypes.includes(param.type)) {
      param.isGeneric = true;
    }

    parsedParameters.push(param);
  });
  return parsedParameters;
}
