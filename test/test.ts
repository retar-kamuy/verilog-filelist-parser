import { describe, it } from 'mocha';
import { expect } from 'chai';
import * as ParserAndLexer from '../src/verilog_filelist';
import { transformTree } from '../src/anyTree';

describe('simplest test:', () => {
  const define = new ParserAndLexer.TsCalcParser().parse(
    '--lint-only -D macro -D macro1=value +define+macro2+macro3 -f run.f src/test $(OS)/test',
  );
  const converted = transformTree(define);

  it('test of kPositonalArgument, "src/test"', () => {
    const args = converted.iterFindAll({ tag: ['kPositionalArgument'] });
    expect(args[0].find({ tag: ['identifier'] }).text).to.equal('src/test');
  });

  it('test of kPositonalArgument, env "$(OS) = Windows_NT"', () => {
    const args = converted.iterFindAll({ tag: ['kPositionalArgument'] });
    expect(args[1].find({ tag: ['identifier'] }).text).to.equal('Windows_NT/test');
  });

  it('test of kFileDeclaration, "run.f"', () => {
    const args = converted.iterFindAll({ tag: ['kFileDeclaration'] });
    expect(args[0].find({ tag: ['identifier'] }).text).to.equal('run.f');
  });

  it('test of kFileDeclaration, "-D macro -D macro1=value +define+macro2+macro3"', () => {
    const args = converted.iterFindAll({ tag: ['kMacroDeclaration'] });
    expect(args[0].find({ tag: ['identifier'] }).text).to.equal('macro');
    expect(args[1].find({ tag: ['identifier'] }).text).to.equal('macro1=value');
    expect(args[0].find({ tag: ['identifier'] }).text).to.equal('macro2');
    expect(args[1].find({ tag: ['identifier'] }).text).to.equal('macro3');
  });
});
