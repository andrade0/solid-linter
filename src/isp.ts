import {InterfaceClass} from "./lib/classes/interface.class";
import {Classse} from "./lib/classes/classse.class";
import {ClasseMethod} from "./lib/classes/ClasseMethod";
import {InterfaceMethod} from "./lib/classes/interfaceMethod";
import {SolidRuntime} from "./lib/types/solidRuntime";
import {blue, file, log, red, white} from "./constants";

export const isp = ({
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
  console.log('---INTERFACE SEGREGATION PRINCIPLE---');
  console.log('-------------------------------------');
  console.log('-------------------------------------');

  let errorsCount: number = 0;

  const errorsShown: string[] = [];

  interfaces.forEach((item: InterfaceClass) => {
    const interfaceName = item.name;
    const classesThatImplementsThisInterface: Classse[] = classes.filter((_class: Classse) => {
      if(_class.implements !== undefined) {
        const interfacesImplementedByThisClass: string[] = _class.implements;
        if(interfacesImplementedByThisClass.includes(interfaceName)) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    });
    classesThatImplementsThisInterface.forEach((classThatImplementsThisInterface: Classse) => {
      const methodsNotImplemented: string[] = [];
      const classMethods = classThatImplementsThisInterface.methods;
      item.methods.forEach((interfaceMethod: InterfaceMethod) => {
        const interfaceMethodName = interfaceMethod.name;
        const exists = classMethods.find((classMethod: ClasseMethod) => {
          return classMethod.name === interfaceMethodName;
        });
        if(!exists) {
          methodsNotImplemented.push(interfaceMethod.name);
        }
      });
      if(methodsNotImplemented.length > 0) {
        const errorToshow = `Interface "${red(interfaceName)}" breaks ${white('Interface Segregation Principle')} because Class "${red(classThatImplementsThisInterface.name)}" implements "${red(interfaceName)}" but ${blue('do not implements')} the following methods : ${red(methodsNotImplemented.join(', '))} \n${file('File:')} ${file(classThatImplementsThisInterface.fileUri)}`;
        if(!errorsShown.includes(errorToshow)) {
          log(errorToshow);
          log('');
          errorsShown.push(errorToshow);
          errorsCount++;
        }
      }
    });
  });

  return errorsCount;
}
