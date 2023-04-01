import * as ts from "typescript";

export const parseNameOjbect = (nameObject: any): string => {
  const kind = ts.SyntaxKind[nameObject.kind]
  switch (kind) {
    case 'StringLiteral':
      if(nameObject.escapedText) {
        return nameObject.text;
      } else {
        return '';
      }
    case 'Identifier':
      if(nameObject.escapedText) {
        return nameObject.escapedText;
      } else {
        return '';
      }
    default:
      console.warn(`Kind ${kind} not handled in function parseNameOjbect`);
      return '';
  }
}
