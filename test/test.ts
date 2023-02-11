import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import * as ParserAndLexer from '../src/verilog_filelist';
import { transformTree } from '../src/anyTree';

describe('simplest test:', () => {
  it('test of kPositonalArgument, because it expects "src/test"', () => {
    const define = new ParserAndLexer.TsCalcParser().parse(
      '--lint-only -D macro -D macro=value +define+macro1+macro2 -f run.f src/test $(SRC)/test',
    );

    const converted = transformTree(define);
    const args = converted.iterFindAll({ tag: ['kPositionalArgument'] });

    const identifiers: string[] = [];
    args.forEach((arg) => identifiers.push(arg.find({ tag: ['identifier'] }).text));
    expect(identifiers[0]).to.equal('src/test');
  });

  it('test of kPositonalArgument, because preprocessorIdentifier expects "SRC/test"', () => {
    const define = new ParserAndLexer.TsCalcParser().parse(
      '--lint-only -D macro -D macro=value +define+macro1+macro2 -f run.f src/test $(SRC)/test',
    );

    const converted = transformTree(define);
    const args = converted.iterFindAll({ tag: ['kPositionalArgument'] });

    const preprocessors: string[] = [];
    args.forEach((arg) => preprocessors.push(arg.find({ tag: ['preprocessorIdentifier'] }).text));
    expect(preprocessors[1]).to.equal('SRC/test');
  });

  it('test of kFileDeclaration, because identifier expects "run.f"', () => {
    const define = new ParserAndLexer.TsCalcParser().parse(
      '--lint-only -D macro -D macro=value +define+macro1+macro2 -f run.f src/test $(SRC)/test',
    );

    const converted = transformTree(define);
    const args = converted.iterFindAll({ tag: ['kFileDeclaration'] });

    const identifiers: string[] = [];
    args.forEach((arg) => identifiers.push(arg.find({ tag: ['identifier'] }).text));
    expect(identifiers[0]).to.equal('run.f');
  });
});
