export const getEscapedText = (node: any): string => {
  // console.log(JSON.stringify(node));
  const obj: any = JSON.parse(JSON.stringify(node));
  // console.log({obj});
  return obj.escapedText;
}



