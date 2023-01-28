import * as ParserAndLexer from './verilog_filelist';
import { transformTree } from './anyTree';

const define = new ParserAndLexer.TsCalcParser().parse(
  '--lint-only -D macro -D macro=value +define+macro1+macro2 -f run.f src/test $(SRC)/test',
);

const converted = transformTree(define);
const args = converted.iterFindAll({ tag: ['kPositionalArgument'] });

console.log('identifier:');
args.forEach((arg) => console.log('  ', arg.find({ tag: ['identifier'] }).text));

console.log('preprocessorIdentifier:');
args.forEach((arg) => console.log('  ', arg.find({ tag: ['preprocessorIdentifier'] }).text));

// console.log('-D macro'.trim(), '=', define);

// const res = new ParserAndLexer.TsCalcParser().parse('-f run.f');
// console.log('-f run.f'.trim(), '=', res);
// const tmp: Node = res;
// console.log('-f run.f'.trim(), '=', tmp.iterFindAll({ tag: ['argumentValue'] }));
