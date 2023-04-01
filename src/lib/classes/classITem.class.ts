import {SyntaxKind} from "typescript";

export abstract class ClassITem {
  name: string;
  modifiers: string[];
  type: string;

  kind?: SyntaxKind | string | undefined;

  constructor() {
    this.modifiers = [];
    this.type = "";
    this.name = "";
  }
}
