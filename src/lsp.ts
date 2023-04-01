import {Classse} from "./lib/classes/classse.class";
import {ClasseMethod} from "./lib/classes/ClasseMethod";
import {SolidRuntime} from "./lib/types/solidRuntime";
import {blue, file, log, red, white} from "./constants";

export const lsp = ({
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
  console.log('----LISKOV SUBSTITUTION PRINCIPLE----');
  console.log('-------------------------------------');
  console.log('-------------------------------------');

  let errorsCount: number = 0;

  classesThatsHaveDerivedClasses.forEach((_parentClass: Classse) => {
    const parentClassName = _parentClass.name;
    const parentClassMethods = _parentClass.methods.filter((__method: ClasseMethod) => {
      if(__method.name !== 'constructor') {
        return true;
      }
    });
    const childClasses = classes.filter((item: Classse) => {
      return item.extendsObj && item.extendsObj.find((extendsObj: Classse) => {
        return extendsObj.name === _parentClass.name;
      });
    });
    parentClassMethods.forEach((parentClassMethod: ClasseMethod) => {
      childClasses.forEach((childClass: Classse) => {
        childClass.methods.forEach((childClassMethod: ClasseMethod) => {
          const childClassMethodName = childClassMethod.name;
          if(childClassMethodName === parentClassMethod.name) {

            let errors: string[] = [];

            if(parentClassMethod.type !== childClassMethod.type) {
              errors.push('Parent Class Method return type is different than Child Class Method return type');
            }

            if (parentClassMethod.parameters.length !== childClassMethod.parameters.length) {
              errors.push('Parent Class Method parameters length is different than Child Class Method parameters length');
            }

            parentClassMethod.parameters.forEach((parentClassMethodParameter, index) => {
              if(parentClassMethodParameter.isGeneric === false && childClassMethod.parameters[index] !== undefined && parentClassMethodParameter.type !== childClassMethod.parameters[index].type) {
                errors.push(`Parent Class Method parameter "${parentClassMethodParameter.name}" type is different than Child Class Method parameter "${childClassMethod.parameters[index].name}" type`);
              }
            });

            if(errors.length > 0) {
              log(`Method "${red(childClassMethodName)}" of Class "${red(childClass.name)}" breaks ${white('Liskov Substitution Principle')} because her ${blue('signature')} is different than method "${red(parentClassMethod.name)}" on parent class "${red(parentClassName)}": ${errors.map(err => red(err)).join(', ')} on file ${file(childClass.fileUri)}`);
              // log('Parent Class Method signature:', _parentClass.methodGetSignature(parentClassMethod.name));
              // log('Child Class Method signature:', childClass.methodGetSignature(childClassMethod.name));
              log('');
              errorsCount++;
            }
          }
        });
      });
    });
  });
  return errorsCount;
}
