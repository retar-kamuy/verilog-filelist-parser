import * as ParserAndLexer from './verilog_filelist';

class Node {
  // private tag: 'optionalArgument' | 'positionalArgument' | 'argumentValue' | 'macroDefine' | 'environmentVariable';

  // private line: number;

  // private endLine: number;

  // private column: number;

  // private endColumn: number;

  // private text: string;

  constructor(
    private children: Node[],
  ) {
    this.children = children;
  }

  iterFind(targetObj: Node | Node[], filter: string, initialValue?: Node[]): Node[] {
    const initValues = initialValue !== undefined ? initialValue : [];
    let foundObjs: Node[] = initValues;
    if (Array.isArray(targetObj)) {
      const objs = targetObj.reduce((founds, obj) => {
        const results = this.iterFind(obj, filter, founds);
        return founds.concat(results);
      }, initValues);
      foundObjs = foundObjs.concat(objs);
    } else if (Object.values(targetObj).indexOf(filter) !== -1) {
      foundObjs.push(targetObj);
    } else {
      const objs = Object.values(targetObj).reduce((founds: Node[], targetValue: Node | string) => {
        if (typeof targetValue === 'object') {
          if (targetValue !== null) {
            return this.iterFind(targetValue, filter, founds);
          }
        }
        return founds;
      }, initValues);
      foundObjs = foundObjs.concat(objs);
    }
    return foundObjs;
  }

  iterFindAll(filters: { [key: string]: string[] }): Node[] {
    let foundObjs: Node[] = [];
    filters.tag.forEach((filter) => {
      foundObjs = foundObjs.concat(this.iterFind(this.children, filter));
    });
    return foundObjs;
  }
}

const define = new ParserAndLexer.TsCalcParser().parse('-D macro -D macro=value +define+macro1+macro2');
console.log('-D macro'.trim(), '=', define);

const res = new ParserAndLexer.TsCalcParser().parse('-f run.f');
console.log('-f run.f'.trim(), '=', res);
const tmp: Node = res;
console.log('-f run.f'.trim(), '=', tmp.iterFindAll({ tag: ['argumentValue'] }));
