import * as ts from "typescript";

export const parseGenericTypes = (typeParameters: any): string[] => {
  const genericTypes: string[] = [];
  if (typeParameters && typeParameters.length > 0) {
    typeParameters.forEach((typeParameter: any) => {
      if(ts.SyntaxKind[typeParameter.kind] === 'TypeParameter') {
        if(typeParameter.name && typeParameter.name.escapedText) {
          if(ts.SyntaxKind[typeParameter.name.kind] === 'Identifier') {
            genericTypes.push(typeParameter.name.escapedText);
          } else {
            console.log(typeParameter.name);
          }
        }
      } else {
        console.log(typeParameter);
      }
    });
  }
  return genericTypes;
}
