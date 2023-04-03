import {Classse} from "./lib/classes/classse.class";
import {ClasseMethod} from "./lib/classes/ClasseMethod";
import {variablesNamesOnSwitchOrIf} from "./lib/types/variablesNamesOnSwitchOrIf";
import {SolidRuntime} from "./lib/types/solidRuntime";
import {blue, file, log, red, white, yellow} from "./constants";
import {FunctionInfo} from "./lib/helpers/parseFunctions";
import {functionParametersUsedInSwitchOrIfStatement} from "./lib/helpers/functionParametersUsedInSwitchOrIfStatement";

export const ocp = ({
                      classes,
                      interfaces,
                      functions,
                      stringClassNames,
                      stringInterfaceNames,
                      classesThatsHaveDerivedClassesNames,
                      classesThatsHaveDerivedClasses
                    }: SolidRuntime): number => {
  console.log('');
  console.log('');
  console.log('');
  console.log('-------------------------------------');
  console.log('-------------------------------------');
  console.log('--------'+blue('OPEN/CLOSED PRINCIPLE')+'--------');
  console.log('-------------------------------------');
  console.log('-------------------------------------');

  let errorsCount: number = 0;
  const errorsShown: string[] = [];

  //classesThatsHaveDerivedClasses.forEach((_class: Classse) => {
  classes.forEach((_class: Classse) => {
    const methods: ClasseMethod[] = _class.methods;
    methods.forEach((method: ClasseMethod) => {
      const methodParametersOrClassProperty: variablesNamesOnSwitchOrIf[] = _class.methodParametersOrClassPropertiesUsedInSwitchOrIfStatement(method.name); // OCP
      if(methodParametersOrClassProperty.length > 0) {
        methodParametersOrClassProperty.forEach((parameterOrClassProperty: variablesNamesOnSwitchOrIf) => {
          const errorToshow = `${method.isConstructor ? 'Constructor' : ('Method "' + red(method.name) + '"')} of Class "${red(_class.name)}" ${yellow('may')} breaks ${white('open/close principle')} because a "${red(parameterOrClassProperty.ifOrSwitch)}" statement has been found with variable "${red(parameterOrClassProperty.variableName)}" \n${file('File:')} ${file(_class.fileUri)}`;
          if(!errorsShown.includes(errorToshow)) {
            log(errorToshow);log('');
            errorsShown.push(errorToshow);
            errorsCount++;
          }
        });
      }
    });
  });

  functions.forEach((_function: FunctionInfo) => {
    const methodParametersOrClassProperty: variablesNamesOnSwitchOrIf[] = functionParametersUsedInSwitchOrIfStatement(_function);
    if(methodParametersOrClassProperty.length > 0) {
      methodParametersOrClassProperty.forEach((parameterOrClassProperty: variablesNamesOnSwitchOrIf) => {
        const errorToshow = `Function ${red(_function.name)} ${yellow('may')} breaks ${white('open/close principle')} because a "${red(parameterOrClassProperty.ifOrSwitch)}" statement has been found with variable "${red(parameterOrClassProperty.variableName)}" \n${file('File:')} ${file(_function.sourceFile.fileName)}`;
        if(!errorsShown.includes(errorToshow)) {
          log(errorToshow);log('');
          errorsShown.push(errorToshow);
          errorsCount++;
        }
      });
    }
  });


  return errorsCount;
}
