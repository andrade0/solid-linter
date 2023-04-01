import fs from "fs";

export const debugJson = (obj: any) => {
  fs.writeFileSync('debug.json', JSON.stringify(obj, null, 2), 'utf8');
}
