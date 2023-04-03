export class ReturnType {
  type: string = 'void';
  isArray: boolean = false;
  isGeneric: boolean = false;
  isPromise: boolean = false;
  composedTypes: ReturnTypeComposed[] = [];

  toString(): string {
    let str = '';
    if(this.isPromise) {
      str += 'Promise<';
    }

    if(this.composedTypes.length > 0) {
      str += this.composedTypes.map((type: ReturnTypeComposed) => type.toString()).join(' | ');
    } else {
      str += this.type;
      if(this.isArray) {
        str += '[]';
      }
    }


    if(this.isPromise) {
      str += '>';
    }
    return str;
  }

  get isComposedType(): boolean {
    return this.composedTypes.length > 0;
  }
}

export class ReturnTypeComposed {
  type: string = 'void';
  isArray: boolean = false;
  isGeneric: boolean = false;

  toString(): string {
    let str = '';
    str += this.type;
    if(this.isArray) {
      str += '[]';
    }
    return str;
  }
}

