import * as ParserAndLexer from './verilog_filelist';

txt = `example.sv`;
res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `-f run.f`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `-Isrc`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

txt = `--include-directory src`;
res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

txt = `example1.sv example2.sv example3.sv`;
res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `-f test1.f -f test2.f`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `-f test.f example.sv`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `+incdir+src +incdir+tb1+tb2`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `-f test.f top_tb.sv -I incdir.f interface.svh`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `-DMODELSIM -DVCS=true`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `--define-macro XCELIUM`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `-D VERILATOR=true`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `+define+VERILATOR=true+MODELSIM+VCS`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);

var txt = `$VAR1 $(VAR2) $\{VAR3\}`;
var res = new ParserAndLexer.TsCalcParser().parse(txt);
console.log(txt.trim(), '=', res);