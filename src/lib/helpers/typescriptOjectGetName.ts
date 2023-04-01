type NestedObject = {
  [key: string]: any;
};

function findNestedProperty(obj: NestedObject, property: string): any {
  if (obj.hasOwnProperty(property)) {
    return obj[property];
  } else {
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        const result = findNestedProperty(obj[key], property);
        if (result !== undefined) {
          return result;
        }
      }
    }
  }

  return undefined;
}


export const typescriptOjectGetName = (typescriptObject: any): string => {
  let output = '';
  const obj = JSON.parse(JSON.stringify(typescriptObject));
  const foundProperty: any | undefined = findNestedProperty(obj, "escapedText");
  if(foundProperty) {
    output = foundProperty;
  }
  return output;
}
