import * as ts from "typescript";

export const parseExtends = (heritageClauses: any): string[] => {
  const extendsArray: string[] = [];
  if(heritageClauses && heritageClauses.length > 0) {
    heritageClauses.forEach((heritageClause: any) => {
      const kind = ts.SyntaxKind[heritageClause.token];
      if(kind === "ExtendsKeyword") {
        heritageClause.types.forEach((type: any) => {
          if(ts.SyntaxKind[type.kind] === 'ExpressionWithTypeArguments') {
            if(ts.SyntaxKind[type.expression.kind] === 'Identifier') {
              if(type.expression && type.expression.escapedText) {
                extendsArray.push(type.expression.escapedText);
              }
            } else {
              console.log(ts.SyntaxKind[type.expression.kind]);
            }
          } else {
            console.log(ts.SyntaxKind[type.kind]);
          }
        });
      } /*else {
        console.log('DEBUG ts.SyntaxKind[heritageClause.token]', ts.SyntaxKind[heritageClause.token], JSON.stringify(heritageClause));
      }*/
    });
  }
  return extendsArray;
}
