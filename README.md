# verilogFilelistParser

[ts-jison](https://github.com/ericprud/ts-jison/tree/main/packages/parser-generator)は構文解析ツール`Bison`のJavaScript版である[Jison](https://github.com/zaach/jison)のTypeScript対応モジュールである。

## インストール方法
```
tsc --init
npm install @ts-jison/parser-generator
```

## 使い方

* `ts-calculator.jison`を作成する。
* `.jison`を`.ts`へ変換する。
```ps
node_modules\.bin\ts-jison.ps1 -t typescript -n TsCalc -n TsCalc -o ts-calculator.ts ts-calculator.jison
```

* 変換した`.ts`を使って構文解析するソースコード(`mygenerator.ts`)を作成する。
```ts
import * as ParserAndLexer from './ts-calculator';

  const txt = `	PI + (3! / 3)^20 / (1+1)^10 / 1024 - 1`;
  const res = new ParserAndLexer.TsCalcParser().parse(txt);
  console.log(txt.trim(), '=', res);
```

* `mygenerator.ts`をビルドする。
```ps
tsc mygenerator.ts
```

* ビルドした`.js`を実行する。
```ps
node mygenerator.js
```

# Mochaの構築方法
```ps
npm install chai mocha ts-node @types/chai @types/mocha --save-dev
```

* テスト実行コマンド
```ps
npm test -- -w
```
