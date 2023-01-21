import * as ParserAndLexer from './verilog_filelist';
import { RootNode, transformTree } from './anyTree';

const define: RootNode[] = new ParserAndLexer.TsCalcParser().parse(
  '-D macro -D macro=value +define+macro1+macro2 -f run.f $(SRC)/test',
);
console.log('-D macro'.trim(), '=', define);
define.forEach((tree) => {
  const converted = transformTree(tree);
  console.dir(converted);
  console.log('-f run.f'.trim(), '=', converted.iterFindAll({ tag: ['kVariableIdentifer'] }));
});

// const define = new ParserAndLexer.TsCalcParser().parse('-D macro -D macro=value +define+macro1+macro2');
// console.log('-D macro'.trim(), '=', define);

// const res = new ParserAndLexer.TsCalcParser().parse('-f run.f');
// console.log('-f run.f'.trim(), '=', res);
// const tmp: Node = res;
// console.log('-f run.f'.trim(), '=', tmp.iterFindAll({ tag: ['argumentValue'] }));
