export const getEscapedText = (node: any): string => {
  const obj: any = JSON.parse(JSON.stringify(node));
  return obj.escapedText;
}



