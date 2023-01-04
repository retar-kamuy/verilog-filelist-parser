JISON = node_modules/.bin/ts-jison
PARSER = verilog_filelist

SRC = test_verilog_filelist

all: run

install:
	npm install @ts-jison/parser-generator

$(PARSER).ts: $(PARSER).jison
	$(JISON) -t typescript -n TsCalc -n TsCalc -o $@ $<

$(SRC).js: $(PARSER).ts $(SRC).ts
	tsc -p tsconfig.json

run: $(SRC).js
	node $<

clean:
	rm -rf $(SRC).js $(PARSER).ts $(PARSER).js
