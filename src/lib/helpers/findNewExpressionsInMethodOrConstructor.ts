import * as ts from "typescript";
import {NewExpression} from "typescript";
import {getEscapedText} from "./getEscapedText";

export const findNewExpressionsInMethodOrConstructor = (_class: ts.ClassDeclaration, member: ts.ConstructorDeclaration | ts.MethodDeclaration, existingClassesArray: string[] = []): string[] => {
  let className: string = '';
  className = getEscapedText(_class.name);
  const errors: string[] = [];
  const memberName = ts.isMethodDeclaration(member) ? getEscapedText(member.name) : 'constructor';
  const newExpressionsConstructor = findNewExpressions(member);
  if (newExpressionsConstructor.length > 0) {
    newExpressionsConstructor.forEach((newExpression: NewExpression) => {
      try {
        if(
          existingClassesArray.indexOf(getEscapedText(newExpression.expression)) >= 0
        ) {
          console.log(`DEPENDENCY INVERSION PRINCIPLE: Class "${className}" breaks Interface Segregation Principle because "${memberName}" has an injection of a non abstract dependency : ${getEscapedText(newExpression.expression)}`);
          console.log('');
        }
      } catch (e) {
        // console.log(e);
      }
    });
  }
  return errors;
}

const findNewExpressions = (member: ts.ConstructorDeclaration | ts.MethodDeclaration | ts.Node): ts.NewExpression[] => {
  const newExpressions: ts.NewExpression[] = [];
  ts.forEachChild(member, (child) => {
    if (ts.isNewExpression(child)) {
      newExpressions.push(child);
    }
    newExpressions.push(...findNewExpressions(child));
  });
  return newExpressions;
}
