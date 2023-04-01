import fs from "fs";
import path from "path";

export const getFilesFromPaths = (folderPath: string): string[] => {
  const filePaths: string[] = [];
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && filePath.endsWith('.ts')) {
      filePaths.push(filePath);
    }
  }
  return filePaths;
}
