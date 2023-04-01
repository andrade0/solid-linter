import * as ts from "typescript";

export const parseModifier = (modifiers: any): string[] => {
  const modifierArray: string[] = [];
  if(modifiers && modifiers.length > 0) {
    modifiers.forEach((modifier: any) => {
      const modifierKind = ts.SyntaxKind[modifier.kind];

      if(modifierKind === 'FirstContextualKeyword'){
        if(modifier.kind === ts.SyntaxKind.AbstractKeyword) {
          modifierArray.push('abstract');
        } else if (modifier.kind === ts.SyntaxKind.DeclareKeyword) {
          modifierArray.push('declare');
        } else if (modifier.kind === ts.SyntaxKind.PublicKeyword) {
          modifierArray.push('public');
        } else if (modifier.kind === ts.SyntaxKind.PrivateKeyword) {
          modifierArray.push('private');
        } else if (modifier.kind === ts.SyntaxKind.ProtectedKeyword) {
          modifierArray.push('protected');
        } else if (modifier.kind === ts.SyntaxKind.StaticKeyword) {
          modifierArray.push('static');
        } else if (modifier.kind === ts.SyntaxKind.ReadonlyKeyword) {
          modifierArray.push('readonly');
        } else if (modifier.kind === ts.SyntaxKind.AsyncKeyword) {
          modifierArray.push('async');
        } else if (modifier.kind === ts.SyntaxKind.DefaultKeyword) {
          modifierArray.push('default');
        } else if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
          modifierArray.push('export');
        } else if (modifier.kind === ts.SyntaxKind.ConstKeyword) {
          modifierArray.push('const');
        } else {
          console.log('DEBUG FirstContextualKeyword', ts.SyntaxKind[modifier.kind]);
        }
      } else {
        if(modifier.expression === undefined) {
          if(modifierKind.match(new RegExp('Keyword'))) {
            modifierArray.push(modifierKind.replace('Keyword', '').toLowerCase());
          } else {
            console.log('DEBUG modifierKind 16', modifierKind);
          }
        } else {
          const expressionKind = ts.SyntaxKind[modifier.expression.kind];
          const expressionExpressionKind = ts.SyntaxKind[modifier.expression.expression.kind];
          const modifierName = modifier.expression.expression.escapedText;
          // console.log(modifierName);
          if(modifier.expression.arguments) {
            const expressionArguments = modifier.expression.arguments;
            expressionArguments.forEach((argument: any) => {
              // console.log(argument);
              if(argument.properties) {
                const argumentProperties = argument.properties;
                argumentProperties.forEach((argumentProperty: any) => {
                  // console.log(argumentProperty);
                });
              }
            });
          }
          // console.log(expressionKind, expressionExpressionKind, modifier.expression);

        }
      }
    });
  }
  return modifierArray;
}

function isAbstractClass(modifiers: any): boolean {
  return (modifiers?.some((modifier: any) => modifier.kind === ts.SyntaxKind.AbstractKeyword)) ?? false;
}
