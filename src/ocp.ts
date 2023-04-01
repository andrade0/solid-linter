import {Classse} from "./lib/classes/classse.class";
import {ClasseMethod} from "./lib/classes/ClasseMethod";
import {variablesNamesOnSwitchOrIf} from "./lib/types/variablesNamesOnSwitchOrIf";
import {SolidRuntime} from "./lib/types/solidRuntime";
import {blue, file, log, red, white} from "./constants";

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
  console.log('--------OPEN/CLOSED PRINCIPLE--------');
  console.log('-------------------------------------');
  console.log('-------------------------------------');

  let errorsCount: number = 0;

  //classesThatsHaveDerivedClasses.forEach((_class: Classse) => {
  classes.forEach((_class: Classse) => {
    const methods: ClasseMethod[] = _class.methods;
    methods.forEach((method: ClasseMethod) => {
      const methodParametersOrClassProperty: variablesNamesOnSwitchOrIf[] = _class.methodParametersOrClassPropertiesUsedInSwitchOrIfStatement(method.name); // OCP
      if(methodParametersOrClassProperty.length > 0) {
        methodParametersOrClassProperty.forEach((parameterOrClassProperty: variablesNamesOnSwitchOrIf) => {
          log(`${method.isConstructor ? red('constructor') : red('method "' + method.name + '"')} of Class "${red(_class.name)}" may breaks ${white('open/close principle')} because a "${red(parameterOrClassProperty.ifOrSwitch)}" statement has been found with class property "${red(parameterOrClassProperty.variableName)}" on file: ${file(_class.fileUri)}`);
          log('');
        });
      }
    });
  });

  return errorsCount;
}
