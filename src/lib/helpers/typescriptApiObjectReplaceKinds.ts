import * as ts from "typescript";

export const typescriptApiObjectReplaceKinds = (obj: any): any => {
  const newObject: any = {...obj};
  for(const key in newObject) {
    if(key === 'pos' && newObject[key] !== undefined) {
      delete newObject.pos;
    } else if(key === 'end' && newObject[key] !== undefined) {
      delete newObject.end;
    } else if(key === 'kind' && newObject[key] !== undefined) {
      newObject[key] = ts.SyntaxKind[obj.kind];
    } else if(typeof newObject[key] === 'object' && newObject[key] !== undefined) {
      newObject[key] = typescriptApiObjectReplaceKinds(newObject[key]);
    }
  }
  return newObject;
};
