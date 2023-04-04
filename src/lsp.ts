import {Classse} from "./lib/classes/classse.class";
import {ClasseMethod} from "./lib/classes/ClasseMethod";
import {SolidRuntime} from "./lib/types/solidRuntime";
import {blue, file, log, red, white, green} from "./constants";
import {Parameter} from "./lib/classes/parameter.class";
import {ReturnTypeComposed} from "./lib/classes/returnType.class";

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
  console.log('----'+blue('LISKOV SUBSTITUTION PRINCIPLE')+'----');
  console.log('-------------------------------------');
  console.log('-------------------------------------');

  let errorsCount: number = 0;
  const errorsShown: string[] = [];

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

            if (parentClassMethod.parameters.length !== childClassMethod.parameters.length) {
              errors.push('Parent Class Method parameters length "'+blue(parentClassMethod.parameters.length)+'" is different than Child Class Method parameters length "'+blue(childClassMethod.parameters.length)+'"');
            }

            if(parentClassMethod.type.toString() !== childClassMethod.type.toString()) {

              let returnTypeErrors: number = 0;

              const parentClassReturnType = parentClassMethod.type.type;
              const parentClassReturnIsPromise = parentClassMethod.type.isPromise;
              const parentClassReturnIsArray = parentClassMethod.type.isArray;
              const parentClassReturnIsGeneric = parentClassMethod.type.isGeneric;
              const parentClassReturnIsComposedType = parentClassMethod.type.isComposedType;

              const childClassReturnType = childClassMethod.type.type;
              const childClassReturnIsPromise = childClassMethod.type.isPromise;
              const childClassReturnIsArray = childClassMethod.type.isArray;
              const childClassReturnIsGeneric = childClassMethod.type.isGeneric;
              const childClassReturnIsComposedType = childClassMethod.type.isComposedType;

              if(parentClassReturnIsPromise !== childClassReturnIsPromise) {
                returnTypeErrors++;
              }

              if(parentClassReturnIsArray !== childClassReturnIsArray) {
                returnTypeErrors++;
              }

              if(parentClassReturnIsComposedType !== childClassReturnIsComposedType) {
                returnTypeErrors++;
              }

              if(
                parentClassReturnType !== childClassReturnType
                && !parentClassReturnIsComposedType
                && !childClassReturnIsComposedType
                && !parentClassReturnIsGeneric
                && !childClassReturnIsGeneric
              ) {
                returnTypeErrors++;
              }

              if(
                parentClassReturnType !== childClassReturnType
                && !parentClassReturnIsComposedType
                && !childClassReturnIsComposedType
                && (!parentClassReturnIsGeneric || !childClassReturnIsGeneric)
              ) {
                // no errors
              }

              if(parentClassReturnIsComposedType && childClassReturnIsComposedType) {

                if(parentClassMethod.type.composedTypes.length !== childClassMethod.type.composedTypes.length) {
                  returnTypeErrors++;
                }

                parentClassMethod.type.composedTypes.forEach((parentClassComposedType: ReturnTypeComposed, index: number) => {

                  const parentClassComposedReturnType = parentClassComposedType.type;
                  const parentClassComposedReturnIsArray = parentClassComposedType.isArray;
                  const parentClassComposedReturnIsGeneric = parentClassComposedType.isGeneric;

                  const childClassComposedReturnType = childClassMethod.type.composedTypes[index].type;
                  const childClassComposedReturnIsArray = childClassMethod.type.composedTypes[index].isArray;
                  const childClassComposedReturnIsGeneric = childClassMethod.type.composedTypes[index].isGeneric;

                  if(parentClassComposedReturnIsArray !== childClassComposedReturnIsArray) {
                    returnTypeErrors++;
                  }

                  if(
                    !parentClassComposedReturnIsGeneric === !childClassComposedReturnIsGeneric
                    && parentClassComposedReturnType !== childClassComposedReturnType) {
                    returnTypeErrors++;
                  }

                });
              }

              if(returnTypeErrors > 0) {
                errors.push(`Parent Class Method return type "${red(parentClassMethod.type.toString())}" is different than Child Class Method return type "${red(childClassMethod.type.toString())}"`);
              }
            }

            parentClassMethod.parameters.forEach((parentClassMethodParameter: Parameter, index: number) => {
              if(
                parentClassMethodParameter.isGeneric === false
                && childClassMethod.parameters[index] !== undefined
                && parentClassMethodParameter.type !== childClassMethod.parameters[index].type
                && parentClassMethodParameter.isArray !== childClassMethod.parameters[index].isArray
              ) {
                errors.push(`Parent Class Method parameter "${red(parentClassMethodParameter.name)}": ${green(parentClassMethodParameter.type)} is different than Child Class Method parameter "${red(childClassMethod.parameters[index].name)}": ${blue(childClassMethod.parameters[index].type)}`);
              }
            });

            if(errors.length > 0) {

              const errorToshow = `\nMethod "${red(childClassMethodName)}" of Class "${green(childClass.name)}" breaks ${white('Liskov Substitution Principle')} because her ${blue('signature')} is different than method "${red(parentClassMethod.name)}" on parent class "${red(parentClassName)}": ${errors.map(err => '\n  - '+err).join('')}\n${file('File:')} ${file(childClass.fileUri)}`;
              if(!errorsShown.includes(errorToshow)) {
                log(errorToshow);
                log('');
                errorsShown.push(errorToshow);
                errorsCount++;
              }

            }
          }
        });
      });
    });
  });
  return errorsCount;
}
