const defType = {
  prefix: 'prefix',
  optional: 'optional',
  variable: 'variable',
  value: 'value',
  positional: 'positional',
} as const;
type DefType = keyof typeof defType;

class Argument {
  private type: DefType;

  private start: number;

  private end: number;

  private syntax: string;

  constructor(type: DefType, start: number, end: number, syntax: string) {
    this.type = type;
    this.start = start;
    this.end = end;
    this.syntax = syntax;
  }
}

const Lexer = {
  prefixes: [/^(-)/, /^(--)/, /^(\+)/],
  optionals: [/^([^+=]+)/],
  operators: [/(\+)/],
  variables: [/([^+=]+)/],
  assignments: [/(=)/],
  values: [/([^+=]+)/],
};

const defState = {
  init: 'init',
  prefix: 'prefix',
  optional: 'optional',
  operator: 'operator',
  variable: 'variable',
  assignment: 'assignment',
  value: 'value',
  positional: 'positional',
} as const;
type DefState = keyof typeof defState;

const matchArgument = (argument: string, regexps: RegExp[]) => regexps.reduce(
  (result, regexp) => {
    const found = argument.match(regexp);
    if (found) {
      return found[1];
    }
    return result;
  },
  '',
);

function analyze(argument: string, offset: number, state: DefState): Argument[] {
  if (state === defState.init) {
    const prefix = matchArgument(argument, Lexer.prefixes);
    if (prefix.length !== 0) {
      const end = offset + prefix.length;
      return [
        new Argument(
          defType.prefix,
          offset,
          end,
          prefix,
        ),
        ...analyze(argument.replace(prefix, ''), end + 1, defState.prefix),
      ];
    }
    return [
      new Argument(
        defType.positional,
        offset,
        offset + argument.length,
        argument,
      ),
    ];
  }

  if (state === defState.prefix) {
    const optional = matchArgument(argument, Lexer.optionals);
    const end = offset + optional.length;

    if (optional.length === argument.length) {
      return [
        new Argument(
          defType.optional,
          offset,
          end,
          optional,
        ),
      ];
    }

    return [
      new Argument(
        defType.optional,
        offset,
        end,
        optional,
      ),
      ...analyze(argument.replace(optional, ''), end + 1, defState.optional),
    ];
  }

  if (state === defState.optional) {
    const operator = matchArgument(argument, Lexer.operators);
    if (operator.length !== 0) {
      const end = offset + operator.length;
      return [
        new Argument(
          defType.optional,
          offset,
          end,
          operator,
        ),
        ...analyze(argument.replace(operator, ''), end + 1, defState.operator),
      ];
    }

    const assignment = matchArgument(argument, Lexer.assignments);
    if (assignment.length !== 0) {
      const end = offset + assignment.length;
      return [
        new Argument(
          defType.optional,
          offset,
          end,
          assignment,
        ),
        ...analyze(argument.replace(assignment, ''), end + 1, defState.assignment),
      ];
    }

    return [
      new Argument(
        defType.optional,
        offset,
        offset + argument.length,
        argument,
      ),
    ];
  }

  if (state === defState.operator) {
    const variable = matchArgument(argument, Lexer.variables);

    if (variable.length === argument.length) {
      return [
        new Argument(
          defType.variable,
          offset,
          offset + variable.length,
          variable,
        ),
      ];
    }

    const end = offset + variable.length;

    return [
      new Argument(
        defType.variable,
        offset,
        offset + variable.length,
        variable,
      ),
      ...analyze(argument.replace(variable, ''), end + 1, defState.optional),
    ];
  }

  if (state === defState.assignment) {
    const value = matchArgument(argument, Lexer.values);

    return [
      new Argument(
        defType.value,
        offset,
        offset + value.length,
        value,
      ),
    ];
  }

  return [];
}

function lexer(args: string): void {
  let analyzedArgs: Argument[] = [];
  args.split(' ').forEach((argument) => {
    analyzedArgs = analyzedArgs.concat(analyze(argument, args.indexOf(argument), defState.init));
    console.dir(analyzedArgs);
  });
}

lexer('-f run.f sample.sv -D+foo=1 +define+hoge+foo=2 +incdir+MACRO +incdir+HOGE+FOO --include-directory=src');
