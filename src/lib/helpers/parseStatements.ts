import {CodeStatement} from "../classes/CodeStatement.class";
import * as ts from "typescript";
import {CodeExpression} from "../classes/codeExpression";
import {typescriptApiObjectReplaceKinds} from "./index";

export const parseStatements = (statements: any): CodeStatement[] => {
  const codeStatements: CodeStatement[] = [];
  if (statements && statements.length > 0) {
    statements.forEach((statement: any) => {
      codeStatements.push(parseStatement(statement));
    });
  }
  return codeStatements;
}

export const parseStatement = (statement: any, isThanStatement: boolean = false): CodeStatement => {

  statement = typescriptApiObjectReplaceKinds(statement)

  const codeStatement = new CodeStatement();
  codeStatement.isthenStatement = isThanStatement;
  codeStatement.kind = statement.kind;
  codeStatement.tsObject = statement as ts.Statement;

  // debugJson(statement);

  if (statement.kind === 'ThrowStatement') {
    codeStatement.type = 'throw';
    codeStatement.value = statement.expression.expression.escapedText;
    codeStatement.name = statement.expression.kind.replace('Expression', '');
    codeStatement.arguments = Object.keys(statement.expression.arguments).map((arg: any) => {
      const argumentValue = statement.expression.arguments[arg].text;
      if (statement.expression.arguments[arg].kind === 'StringLiteral') {
        return `'${argumentValue}'`;
      } else {
        return argumentValue;
      }
    });
  } else if (statement.kind === 'ReturnStatement') {
    codeStatement.type = 'return';
    if (statement.expression && statement.expression.kind === 'Identifier') {
      codeStatement.value = statement.expression.escapedText;
    } else if ( statement &&  statement.expression &&  statement.expression.text){
      codeStatement.value = statement.expression.text;
    }
    codeStatement.name = '';
    codeStatement.arguments = [];
  } else if (statement.kind === 'IfStatement') {
    codeStatement.type = 'if';
    if (statement.expression.kind === 'BinaryExpression') {
      codeStatement.name = statement.expression.operatorToken.kind;
      codeStatement.type = statement.expression.left.escapedText;
      codeStatement.value = statement.expression.right.text;
    }

    if (codeStatement.name === 'EqualsEqualsEqualsToken') {
      codeStatement.name = '==='
    }

  } else if (statement.kind === 'SwitchStatement') {
    // console.log(statement);
  }
  codeStatement.expression = parseExpression(statement.expression);

  if (statement.thenStatement) {
    codeStatement.statements = [...codeStatement.statements, parseStatement(statement.thenStatement, true)];
  }

  if (statement.declarationList) {
    codeStatement.statements = [...codeStatement.statements, parseDeclarationList(statement.declarationList)];
  }

  if (statement.statements) {
    codeStatement.statements = [...codeStatement.statements, ...parseStatements(statement.statements)];
  }

  return codeStatement;
}

export const parseExpression = (expression: any): CodeExpression | undefined => {
  if (!expression) {
    return undefined;
  }

  const codeExpression = new CodeExpression();
  const kind = ts.SyntaxKind[expression.kind];
  const left = expression.left ? expression.left.escapedText : undefined;
  const right = expression.right ? expression.right.escapedText : undefined;
  const operator = expression.operatorToken ? expression.operatorToken.escapedText : undefined;
  const value = expression.text ? expression.text : undefined;
  codeExpression.kind = kind;
  codeExpression.value = value;
  codeExpression.left = left;
  codeExpression.right = right;
  codeExpression.operator = operator;
  codeExpression.tsObject = expression as ts.Expression;
  if (kind === 'Identifier') {
    codeExpression.value = expression.escapedText;
  } else if (kind === 'PropertyAccessExpression') {
    codeExpression.value = expression.name.escapedText;
  } else if (kind === 'CallExpression') {
    const expressionKind = ts.SyntaxKind[expression.expression.kind];
    codeExpression.kind = expressionKind;
  } else if (kind === 'BinaryExpression') {
  } else if (kind === 'NewExpression') {

    codeExpression.kind = expression.expression.escapedText;
  } else {
  }
  return codeExpression;
}

export const parseDeclarationList = (declarationList: any): CodeStatement => {
  const codeStatement = new CodeStatement();

  const kind = ts.SyntaxKind[declarationList.kind];
  codeStatement.kind = kind;
  codeStatement.tsObject = declarationList as ts.Statement;

  if (declarationList.declarations && declarationList.declarations.length > 0) {
    declarationList.declarations.forEach((declaration: any) => {
      codeStatement.expression = new CodeExpression();
      codeStatement.expression.kind = ts.SyntaxKind[declaration.kind];
      codeStatement.expression.value = declaration.name.escapedText;
    });
  }

  return codeStatement;
}
