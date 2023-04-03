import {Classse} from "./lib/classes/classse.class";
import {ClasseMethod} from "./lib/classes/ClasseMethod";
import {variableNameAndType} from "./lib/types/variableNameAndType";
import {SolidRuntime} from "./lib/types/solidRuntime";
import {blue, file, log, red, white} from "./constants";


export const dip = ({
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
  console.log('----DEPENDENCY INVERSION PRINCIPLE---');
  console.log('-------------------------------------');
  console.log('-------------------------------------');

  let errorsCount: number = 0;

  const errorsShown: string[] = [];

  classes.forEach((_class: Classse) => {
    const methods: ClasseMethod[] = _class.methods;
    methods.forEach((method: ClasseMethod) => {

      // const classPropertiesNames: string[] = _class.properties.map((property: any) => property.name);

      const classesInstanciedInMethodWithNewKeyword: variableNameAndType[] = _class.classesInstanciedInMethodWithNewKeyword(method.name, stringClassNames);

      if(classesInstanciedInMethodWithNewKeyword.length > 0) {
        classesInstanciedInMethodWithNewKeyword.forEach((item: variableNameAndType) => {
          const className: string = item.type;
          const variableName: string = item.variableName;
          if(stringClassNames.includes(className)) {
            const errorToshow = `Class "${red(_class.name)}" may breaks ${white('dependencies inversion Principle')} because method "${red(method.name)}" creates a "${red('new')}" instance of class "${red(className)}" in property "${red(variableName)}" instead of using ${blue('injection')} on file: ${file(_class.fileUri)}`;
            if(!errorsShown.includes(errorToshow)) {
              log(errorToshow);
              errorsShown.push(errorToshow);
              log('');
              errorsCount++;
            }
          }
        });
      }

      _class.injecteds.forEach((dependency: string) => {
        if(stringClassNames.includes(dependency) && !stringInterfaceNames.includes(dependency)) {
          const errorToshow = `Class "${red(_class.name)}" breaks ${white('dependencies inversion Principle')} because class has injection of a ${blue('non abstract dependency')}: ${red(dependency)} \n${file('File:')} ${file(_class.fileUri)}`;
          if(!errorsShown.includes(errorToshow)) {
            log(errorToshow);
            log('');
            errorsShown.push(errorToshow);
            errorsCount++;
          }
        }
      });
    });
  });
  return errorsCount;
}
