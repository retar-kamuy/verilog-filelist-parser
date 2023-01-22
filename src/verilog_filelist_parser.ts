import * as ParserAndLexer from './verilog_filelist';
import { transformTree } from './anyTree';

const define = new ParserAndLexer.TsCalcParser().parse(
  '--lint-only -D macro -D macro=value +define+macro1+macro2 -f run.f $(SRC)/test',
);
console.log('-D macro'.trim(), '=', define);
const converted = transformTree(define);
console.dir(converted);
const findAll = converted.iterFindAll({ tag: ['kVariableIdentifier'] });
console.log('-f run.f'.trim(), '=', findAll);
findAll.forEach((find) => {
  console.log(find.find({ tag: ['identifier'] }));
});

// const define = new ParserAndLexer.TsCalcParser().parse('-D macro -D macro=value +define+macro1+macro2');
// console.log('-D macro'.trim(), '=', define);

// const res = new ParserAndLexer.TsCalcParser().parse('-f run.f');
// console.log('-f run.f'.trim(), '=', res);
// const tmp: Node = res;
// console.log('-f run.f'.trim(), '=', tmp.iterFindAll({ tag: ['argumentValue'] }));
