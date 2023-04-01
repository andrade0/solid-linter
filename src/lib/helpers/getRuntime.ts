import {
  getAllClassesAndInterfacesAndFunctions, ClassDeclarationWithSourceFile, InterfaceDeclarationWithSourceFile, safeStringify
} from "./index";
import {InterfaceClass} from "../classes/interface.class";
import {Classse} from "../classes/classse.class";
import {SolidRuntime} from "../types/solidRuntime";

export const getRuntime = (folderPath: string): SolidRuntime => {

  const {interfaces, classes, functions} = getAllClassesAndInterfacesAndFunctions(folderPath);

  let finalInterfaces: InterfaceClass[] = [];
  interfaces.forEach((item: InterfaceDeclarationWithSourceFile) => {
    finalInterfaces.push(new InterfaceClass(item));
  });

  finalInterfaces = finalInterfaces.map((_interface: InterfaceClass) => {
    if(_interface.extends && _interface.extends.length > 0) {
      _interface.extends.forEach((extendsString: string) => {
        const exists: InterfaceClass | undefined = finalInterfaces.find((item: InterfaceClass) => {
          return item.name === extendsString;
        });
        if(exists !== undefined) {
          if(!_interface.extends) {
            _interface.extendsObj = [];
          }
          _interface.extendsObj.push(exists);
        }
      });
    }
    return _interface;
  });

  let finalClasses: Classse[] = [];
  classes.forEach((item: ClassDeclarationWithSourceFile) => {
    finalClasses.push(new Classse(item));
  });


  finalClasses = finalClasses.map((_class: Classse) => {
    if(_class.extends && _class.extends.length > 0) {
      _class.extends.forEach((extendsString: string) => {
        const exists: Classse | undefined = finalClasses.find((item: Classse) => {
          return item.name === extendsString;
        });
        if(exists !== undefined) {
          if(!_class.extendsObj) {
            _class.extendsObj = [];
          }
          _class.extendsObj.push(exists);
        }
      });
    }

    if(_class.implements && _class.implements.length > 0) {
      _class.implements.forEach((implementsString: string) => {
        const exists: InterfaceClass | undefined = finalInterfaces.find((item: InterfaceClass) => {
          return item.name === implementsString;
        });
        if(exists !== undefined) {
          if(!_class.implementsObj) {
            _class.implementsObj = [];
          }
          _class.implementsObj.push(exists);
        }
      });
    }
    return _class;
  });

  const classesThatsHaveDerivedClasses: Classse[] = finalClasses.reduce((memo: Classse[], _class: Classse) => {
    if (_class.extendsObj && _class.extendsObj.length > 0) {
      _class.extendsObj.forEach((extendsObj: Classse) => {
        const exists = memo.find((item: Classse) => {
          return item.name === extendsObj.name;
        });
        if (!exists) {
          memo.push(extendsObj);
        }
      });
    }
    return memo;
  }, []);

  const classesThatsHaveDerivedClassesNames: string[] = classesThatsHaveDerivedClasses.map((item: Classse) => {
    return item.name;
  });

  const stringClassNames: string[] = finalClasses.map((item: Classse) => {
    return item.name;
  });

  const stringInterfaceNames: string[] = finalInterfaces.map((item: InterfaceClass) => {
    return item.name;
  });

  return {
    classes: finalClasses,
    interfaces: finalInterfaces,
    functions,
    classesThatsHaveDerivedClasses,
    classesThatsHaveDerivedClassesNames,
    stringClassNames,
    stringInterfaceNames
  } as SolidRuntime;
}



// fs.writeFileSync('debug.json', JSON.stringify(finalClasses[4], null, 2), 'utf8');


