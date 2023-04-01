import * as ts from "typescript";

export const parseType = (typeobj: any): string => {

  if(!typeobj) return '';

  if(typeobj.kind === undefined) return '';

  const kind = ts.SyntaxKind[typeobj.kind];

  if(kind === 'TypeReference') {
    if(typeobj.typeName) {
      const kindOfTypeName = ts.SyntaxKind[typeobj.typeName.kind];
      if(kindOfTypeName === 'Identifier') {
        /*if(typeobj.typeName.escapedText === 'Promise'){
          console.log('DEBUG Promise', typeobj);
        }*/
        return typeobj.typeName.escapedText;
      } else {
        console.log('DEBUG kindOfTypeName', kindOfTypeName);
      }
    } else {
      console.log('DEBUG typeobj', typeobj);
    }
  } else {
    return kind.replace('Keyword', '').toLowerCase();
  }

  // console.log(kind, typeobj);

  return '';


  let typeoutput: string = '';
  const type = ts.SyntaxKind[typeobj.kind];
  if (type === "StringKeyword") {
    typeoutput = "string";
  } else if (type === "NumberKeyword") {
    typeoutput = "number";
  } else if (type === "BooleanKeyword") {
    typeoutput = "boolean";
  } else if (type === "AnyKeyword") {
    typeoutput = "any";
  } else if (type === "VoidKeyword") {
    typeoutput = "void";
  } else if (type === "NullKeyword") {
    typeoutput = "null";
  } else if (type === "UndefinedKeyword") {
    typeoutput = "undefined";
  } else if (type === "NeverKeyword") {
    typeoutput = "never";
  } else if (type === "ObjectKeyword") {
    typeoutput = "object";
  } else if (type === "ArrayKeyword") {
    typeoutput = "array";
  } else if (type === "TupleKeyword") {
    typeoutput = "tuple";
  } else if (type === "UnionKeyword") {
    typeoutput = "union";
  } else if (type === "IntersectionKeyword") {
    typeoutput = "intersection";
  } else if (type === "ConditionalKeyword") {
    typeoutput = "conditional";
  } else if (type === "InferKeyword") {
    typeoutput = "infer";
  } else if (type === "ParenthesizedKeyword") {
    typeoutput = "parenthesized";
  } else if (type === "DateKeyword") {
    typeoutput = "Date";
  } else if (type === "RegExpKeyword") {
    typeoutput = "RegExp";
  } else if (type === "EnumKeyword") {
    typeoutput = "Enum";
  } else if (type === "TypeReference") {
    const typeRef = typeobj.typeName.escapedText;
    const typeRefKind = ts.SyntaxKind[typeobj.typeName.kind];
    if(typeRefKind === "Identifier" && typeRef === "Promise") {
      if(typeobj.typeArguments && typeobj.typeArguments.length > 0) {
        typeoutput = `Promise<${parseType(typeobj.typeArguments[0])}>`;
        // console.log('DEBUG', typeoutput);
      }
    } else if(typeRefKind === "Identifier" && typeRef === "Array") {
      if(typeobj.typeArguments && typeobj.typeArguments.length > 0) {
        typeoutput = `${parseType(typeobj.typeArguments[0])}[]`;
      }
    } else if(typeRefKind === "Identifier" && typeRef === "Enumerable") {
      if(typeobj.typeArguments && typeobj.typeArguments.length > 0) {
        typeoutput = `${parseType(typeobj.typeArguments[0])}`;
      }
    } else  {
      typeoutput = typeRef;
    }
  } else {
    // console.log('DEBUG', typeobj);
    // console.log('DEBUG', type);
  }
  return typeoutput;
}
