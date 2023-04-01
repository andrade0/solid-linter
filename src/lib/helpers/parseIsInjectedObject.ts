export const parseIsInjectedObject = (modifiers: any[]): boolean => {
  let ret = false;
  modifiers.forEach((modifier: any) => {
    if(modifier && modifier.expression && modifier.expression.expression && modifier.expression.expression.escapedText) {
      if(modifier.expression.expression.escapedText.toLowerCase() === 'inject') {
        // console.log(name, modifier.expression.expression.escapedText.toLowerCase(), modifier.expression.expression.escapedText.toLowerCase() === 'inject');
        ret = true;
      }
    }
  });
  return ret;
}


