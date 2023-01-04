%lex

%%
[\s\t]+                         /* skipping whitespace */
[^-+=\s$(){}][^+=\s$(){}]+      return 'STRING';
("-f")|("-F")                   return 'F'; /* Parse arguments from a file */
("-I")|("--include-directory")  return 'INCLUDE_DIRECTORY'; /* Directory to search for includes */
"+incdir"                       return 'INCDIR'; /* Directory to search for includes */
("-D")|("--define-macro")       return 'DEFINE_MACRO'; /* Set preprocessor define */
"+define"                       return 'DEFINE'; /* Set preprocessor define */
"$"                             return '$';
[({]                            return '(';
[)}]                            return ')';
"+"                             return '+';
"="                             return '=';
<<EOF>>                         return 'EOF';

/lex

/* operator associations and precedence */

%start expressions

%% /* language grammar */

expressions
    : argument EOF { return $1; }
    ;

argument
    : positional { $$ = [$1]; }
    | optional { $$ = [$1]; }
    | positional argument { $$ = [$1].concat($2); }
    | optional argument { $$ = [$1].concat($2); }
    ;

optional
    : I_DIR
        {
            $$ = {
                tag: 'optionalArgument',
                line: _$[_$.length - 1].first_line,
                endLine: _$[_$.length - 1].last_line,
                column: _$[_$.length - 1].first_column,
                endColumn: _$[_$.length - 1].first_column + 2,
                text: $1.substr(0, 2),
                children: [{
                    tag: 'argumentValue',
                    line: _$[_$.length - 1].first_line,
                    endLine: _$[_$.length - 1].last_line,
                    column: _$[_$.length - 1].first_column + 2,
                    endColumn: _$[_$.length - 1].last_column,
                    text: $1.substr(2),
                }],
            };
        }
    | DEFINE_MACRO factor
        {
            $$ = {
                tag: 'optionalArgument',
                line: _$[_$.length - 2].first_line,
                endLine: _$[_$.length - 2].last_line,
                column: _$[_$.length - 2].first_column,
                endColumn: _$[_$.length - 2].last_column,
                text: $1,
                children: [$2],
            };
        }
    | F factor
        {
            $$ = {
                tag: 'optionalArgument',
                line: _$[_$.length - 2].first_line,
                endLine: _$[_$.length - 2].last_line,
                column: _$[_$.length - 2].first_column,
                endColumn: _$[_$.length - 2].last_column,
                text: $1,
                children: [$2],
            };
        }
    | INCLUDE_DIRECTORY factor
        {
            $$ = {
                tag: 'optionalArgument',
                line: _$[_$.length - 2].first_line,
                endLine: _$[_$.length - 2].last_line,
                column: _$[_$.length - 2].first_column,
                endColumn: _$[_$.length - 2].last_column,
                text: $1,
                children: [$2],
            };
        }
    | INCDIR '+' add_factor
        {
            $$ = {
                tag: 'optionalArgument',
                line: _$[_$.length - 3].first_line,
                endLine: _$[_$.length - 3].last_line,
                column: _$[_$.length - 3].first_column,
                endColumn: _$[_$.length - 3].last_column,
                text: $1,
                children: $3,
            };
        }
    | DEFINE '+' add_factor
        {
            $$ = {
                tag: 'optionalArgument',
                line: _$[_$.length - 3].first_line,
                endLine: _$[_$.length - 3].last_line,
                column: _$[_$.length - 3].first_column,
                endColumn: _$[_$.length - 3].last_column,
                text: $1,
                children: $3,
            };
        }
    ;

add_factor
    : factor
        {
            $$ = [$1];
        }
    | factor '+' add_factor
        {
            $$ = [$1, ...$3];
        }
    ;

positional
    : STRING
        {
            $$ = {
                tag: 'positionalArgument',
                line: _$[_$.length - 1].first_line,
                endLine: _$[_$.length - 1].last_line,
                column: _$[_$.length - 1].first_column,
                endColumn: _$[_$.length - 1].last_column,
                text: $1,
            };
        }
    | '$' env_var
        {
            $$ = $2;
        }
    | '$' '(' env_var ')'
        {
            $$ = $3;
        }
    ;

factor
    : STRING
        {
            $$ = {
                tag: 'argumentValue',
                line: _$[_$.length - 1].first_line,
                endLine: _$[_$.length - 1].last_line,
                column: _$[_$.length - 1].first_column,
                endColumn: _$[_$.length - 1].last_column,
                text: $1,
            };
        }
    | '$' env_var
        {
            $$ = $2;
        }
    | '$' '(' env_var ')'
        {
            $$ = $3;
        }
    | STRING '=' factor
        {
            $$ = {
                tag: 'preprocessorSymbol',
                line: _$[_$.length - 3].first_line,
                endLine: _$[_$.length - 3].last_line,
                column: _$[_$.length - 3].first_column,
                endColumn: _$[_$.length - 3].last_column,
                text: $1,
                children: [$3],
            };
        }
    ;

env_var
    : STRING
        {
            $$ = {
                tag: 'environmentVariable',
                line: _$[_$.length - 1].first_line,
                endLine: _$[_$.length - 1].last_line,
                column: _$[_$.length - 1].first_column,
                endColumn: _$[_$.length - 1].last_column,
                text: $1,
            };
        }
    ;