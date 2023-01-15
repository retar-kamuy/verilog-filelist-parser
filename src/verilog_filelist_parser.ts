import { transformTree } from './anyTree';

const define = transformTree(undefined);

// const define = new ParserAndLexer.TsCalcParser().parse('-D macro -D macro=value +define+macro1+macro2');
// console.log('-D macro'.trim(), '=', define);

// const res = new ParserAndLexer.TsCalcParser().parse('-f run.f');
// console.log('-f run.f'.trim(), '=', res);
// const tmp: Node = res;
// console.log('-f run.f'.trim(), '=', tmp.iterFindAll({ tag: ['argumentValue'] }));
