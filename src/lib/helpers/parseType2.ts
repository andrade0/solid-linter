import * as ts from "typescript";
import {ReturnType, ReturnTypeComposed} from "../classes/returnType.class";

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


export const parseReturnType = (className: string, methodName: string, typeobj: any, methodGenericTypes: string[]): ReturnType => {
  const returnType = new ReturnType();

  if(!typeobj) return returnType;

  if(typeobj.kind === undefined) return returnType;

  if(typeobj.typeName && typeobj.typeName.escapedText === 'Promise') {
    returnType.isPromise = true;
    if(typeobj.typeArguments && typeobj.typeArguments.length > 0) {
      typeobj.typeArguments.forEach((typeArgument: any) => {
        if(ts.SyntaxKind[typeArgument.kind] === 'UnionType' && typeArgument.types && typeArgument.types.length > 0) {
          typeArgument.types.forEach((unionType: any) => {
            const newUnionType = new ReturnTypeComposed();
            if(ts.SyntaxKind[unionType.kind] === 'TypeReference') {
              newUnionType.type = parseType2(unionType);
              newUnionType.isGeneric = methodGenericTypes.includes(newUnionType.type.replace('[]', ''));
            } else if (ts.SyntaxKind[unionType.kind] === 'ArrayType') {
              newUnionType.isArray = true;
              if(unionType.elementType) {
                newUnionType.type = parseType2(unionType.elementType);
                newUnionType.isGeneric = methodGenericTypes.includes(newUnionType.type.replace('[]', ''));
              }
            }
            returnType.composedTypes.push(newUnionType);
            // if(className === 'AbstractAbilitiesService' && methodName === 'assertUserOwns') {
            //   console.log(unionType);
            // }
          });

        } else if(ts.SyntaxKind[typeArgument.kind] === 'TypeReference') {
          returnType.type = parseType2(typeArgument);
          returnType.isGeneric = methodGenericTypes.includes(returnType.type.replace('[]', ''));
        } else if(ts.SyntaxKind[typeArgument.kind] === 'ArrayType') {
          returnType.isArray = true;
          if(typeArgument.elementType) {
            returnType.type = parseType2(typeArgument.elementType);
            returnType.isGeneric = methodGenericTypes.includes(returnType.type.replace('[]', ''));
          }
        }
      });
    }
  } else {
    if(ts.SyntaxKind[typeobj.kind] === 'UnionType' && typeobj.types && typeobj.types.length > 0) {
      typeobj.types.forEach((unionType: any) => {
        const newUnionType = new ReturnType();
        if(ts.SyntaxKind[unionType.kind] === 'TypeReference') {
          newUnionType.type = parseType2(unionType);
          newUnionType.isGeneric = methodGenericTypes.includes(newUnionType.type.replace('[]', ''));
        } else if (ts.SyntaxKind[unionType.kind] === 'ArrayType') {
          newUnionType.isArray = true;
          if(unionType.elementType) {
            newUnionType.type = parseType2(unionType.elementType);
            newUnionType.isGeneric = methodGenericTypes.includes(newUnionType.type.replace('[]', ''));
          }
        }
        returnType.composedTypes.push(newUnionType);
      });
    } else if(ts.SyntaxKind[typeobj.kind] === 'ArrayType') {
      returnType.isArray = true;
      if(typeobj.elementType) {
        returnType.type = parseType2(typeobj.elementType).replace('[]', '');
        returnType.isGeneric = methodGenericTypes.includes(returnType.type.replace('[]', ''));
      }
    } else if(ts.SyntaxKind[typeobj.kind] === 'TypeReference') {
      returnType.type = parseType2(typeobj).replace('[]', '');
      returnType.isGeneric = methodGenericTypes.includes(returnType.type.replace('[]', ''));
    } else {
      returnType.type = ts.SyntaxKind[typeobj.kind].replace('Keyword', '').toLowerCase();
      returnType.isGeneric = methodGenericTypes.includes(returnType.type.replace('[]', ''));
    }

    // if(className === 'AbstractAbilitiesService' && methodName === 'assertUserOwns') {
    //   console.log('kind', ts.SyntaxKind[typeobj.kind]);
    // }
  }

  // if(className === 'AbstractAbilitiesService' && methodName === 'assertUserOwns') {
  //   console.log('DEBUG', returnType, returnType.toString());
  // }

  return returnType;
}
