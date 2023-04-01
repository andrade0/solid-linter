import {Classse} from "../classes/classse.class";
import {InterfaceClass} from "../classes/interface.class";
import {FunctionInfo} from "../helpers/parseFunctions";

export type SolidRuntime = {
  classes: Classse[];
  interfaces: InterfaceClass[];
  functions: FunctionInfo[];
  classesThatsHaveDerivedClasses: Classse[];
  classesThatsHaveDerivedClassesNames: string[];
  stringClassNames: string[];
  stringInterfaceNames: string[];
}
