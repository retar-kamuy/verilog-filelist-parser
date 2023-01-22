JISON = node_modules/.bin/ts-jison
PARSER = verilog_filelist

SECDIR = src
OUTDIR = dist
SRC = $(SECDIR)/verilog_filelist.jison



all: run

install:
	npm install @ts-jison/parser-generator

$(SECDIR)/$(PARSER).ts: $(SRC)
	$(JISON) -t typescript -n TsCalc -n TsCalc -o $@ $<

$(SRC).js: $(SRC).ts
	tsc -p tsconfig.json

$(OUTDIR)/$(PARSER).js: $(SRC)
	$(JISON) -n TsCalc -n TsCalc -o $@ $<

build: $(SECDIR)/$(PARSER).ts $(OUTDIR)/$(PARSER).js

run: $(SRC).js
	node $<

clean:
	rm -rf $(SRC).js $(PARSER).ts $(PARSER).js
