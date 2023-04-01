import * as ts from "typescript";

export const parseType2 = (typeobj: any): string => {
  if(!typeobj) return '';

  if(typeobj.kind === undefined) return '';

  const kind = ts.SyntaxKind[typeobj.kind];

  if(kind === 'TypeReference') {
    if(typeobj.typeName) {
      const kindOfTypeName = ts.SyntaxKind[typeobj.typeName.kind];
      if(kindOfTypeName === 'Identifier') {
        if(typeobj.typeArguments !== undefined) {
          const typeWithArguments = typeobj.typeName.escapedText;
          const typeArguments = typeobj.typeArguments.map((typeArgument: any) => {
            const ret = parseType2(typeArgument);
            if(ret === 'arraytype'){
              console.log('DEBUG arraytype', typeArgument);
            }
            return ret;
          });
          return `${typeWithArguments}<${typeArguments.join('|')}>`;
        } else {
          return typeobj.typeName.escapedText;
        }
      } else if(kindOfTypeName === 'FirstNode') {
        if(typeobj.typeName.left && typeobj.typeName.right) {
          const left = typeobj.typeName.left.escapedText;
          const right = typeobj.typeName.right.escapedText;
          return `${left}.${right}`;
        } else {
          console.log('DEBUG kindOfTypeNameFirstNode', kindOfTypeName, typeobj);
        }
        console.log('DEBUG kindOfTypeName', kindOfTypeName, typeobj);
      } else {
        console.log('DEBUG kindOfTypeName', kindOfTypeName, typeobj);
      }
    } else {
      console.log('DEBUG typeobj', typeobj);
    }
  } else {
    if(kind === 'ArrayType' && typeobj.elementType) {
      const elementType = parseType2(typeobj.elementType);
      return `${elementType}[]`;
    } else {
      return kind.replace('Keyword', '').toLowerCase();
    }
  }

  return '';
}
