%lex

%%
[\s\t]+                                                 /* skipping whitespace */
[^-+=\s$(){}][^+=\s$(){}]+      return 'STRING';
("-f")|("-F")                   return 'FILE';          /* Parse arguments from a file */
("-F")                          return 'FILE';          /* Parse arguments from a file */
("-I")|("--include-directory")  return 'INCLUDE';       /* Directory to search for includes */
"+incdir"                       return 'INCLUDE_LIST';  /* Directory to search for includes */
("-D")|("--define-macro")       return 'MACRO';         /* Set preprocessor define */
"+define"                       return 'MACRO_LIST';    /* Set preprocessor define */
"$"                             return '$';
"("                             return '(';
")"                             return ')';
"{"                             return '{';
"}"                             return '}';
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
  : positional_argument { $$ = [$1]; }
  | optional_argument { $$ = [$1]; }
  | positional_argument argument { $$ = [$1].concat($2); }
  | optional_argument argument { $$ = [$1].concat($2); }
  ;

optional_argument
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
  | include_argument
    {
      $$ = $1;
    }
  | macro_argument
    {
      $$ = $1;
    }
  | file_argument
    {
      $$ = $1;
    }
  ;

include_argument
  : INCLUDE include_declaration
    {
      $$ = {
        tag: 'kArgumentDeclaration',
        children: [
          {
            tag: 'argumentType',
            line: _$[_$.length - 2].first_line,
            endLine: _$[_$.length - 2].last_line,
            column: _$[_$.length - 2].first_column,
            endColumn: _$[_$.length - 2].last_column,
            text: $1,
          }, {
            tag: 'kIncludeDeclaration',
            children: [$2],
          }
        ],
      }
    }
  | INCLUDE_LIST + include_declaration_list
    {
      $$ = {
        tag: 'kArgumentDeclaration',
        children: [
          {
            tag: 'argumentType',
            line: _$[_$.length - 3].first_line,
            endLine: _$[_$.length - 3].last_line,
            column: _$[_$.length - 3].first_column,
            endColumn: _$[_$.length - 3].last_column,
            text: $1,
          }, {
            tag: 'kIncludeDeclarationList',
            children: [$3],
          }
        ],
      }
    }
  ;

include_declaration
  : identifier
    {
      $$ = {
        tag: 'kIncludeDeclaration',
        children: [$1],
      };
    }
  ;

include_declaration_list
  : include_declaration
    {
      $$ = [$1];
    }
  | include_declaration '+' include_declaration_list
    {
      $$ = [$1, ...$3];
    }
  ;

file_argument
  : FILE identifier
    {
      $$ = {
        tag: 'kArgumentDeclaration',
        children: [
          {
            tag: 'argumentType',
            line: _$[_$.length - 2].first_line,
            endLine: _$[_$.length - 2].last_line,
            column: _$[_$.length - 2].first_column,
            endColumn: _$[_$.length - 2].last_column,
            text: $1,
          }, {
            tag: 'kFileDeclaration',
            children: [$2],
          }
        ],
      }
    }
  ;

macro_argument
  : MACRO macro_declaration
    {
      $$ = {
        tag: 'kArgumentDeclaration',
        children: [
          {
            tag: 'argumentType',
            line: _$[_$.length - 2].first_line,
            endLine: _$[_$.length - 2].last_line,
            column: _$[_$.length - 2].first_column,
            endColumn: _$[_$.length - 2].last_column,
            text: $1,
          }, {
            tag: 'kMacroDeclaration',
            children: [$2],
          }
        ],
      };
    }
  | MACRO_LIST '+' macro_declaration_list
    {
      $$ = {
        tag: 'kArgumentDeclaration',
        children: [
          {
            tag: 'argumentType',
            line: _$[_$.length - 3].first_line,
            endLine: _$[_$.length - 3].last_line,
            column: _$[_$.length - 3].first_column,
            endColumn: _$[_$.length - 3].last_column,
            text: $1,
          }, {
            tag: 'kMacroDeclarationList',
            children: [$3],
          },
        ],
      };
    }
  ;

macro_declaration
  : identifier
    {
      $$ = {
        tag: 'kMacroDeclaration',
        children: [$1],
      };
    }
  | identifier '=' identifier
    {
      $$ = {
        tag: 'kMacroDeclaration',
        children: [$1, $3],
      };
    }
  ;

macro_declaration_list
  : macro_declaration
    {
      $$ = [$1];
    }
  | macro_declaration '+' macro_declaration_list
    {
      $$ = [$1, ...$3];
    }
  ;

positional_argument
  : identifier
    {
      $$ = $1;
    }
  ;

identifier
  : string_literal
    {
      $$ = $1;
    }
  | variable identifier
    {
      $$ = {
        tag: 'kVariableIdentifier',
        children: [$1, $2],
      };
    }
  ;

variable
  : '$' string_literal
    {
      $$ = {
        tag: 'kVariable',
        children: [$2],
      };
    }
  | '$' '(' string_literal ')'
    {
      $$ = {
        tag: 'kVariable',
        children: [$3],
      };
    }
  | '$' '{' string_literal '}'
    {
      $$ = {
        tag: 'kVariable',
        children: [$3],
      };
    }
  ;

string_literal
  : STRING
    {
      $$ = {
        tag: 'identifier',
        line: _$[_$.length - 1].first_line,
        endLine: _$[_$.length - 1].last_line,
        column: _$[_$.length - 1].first_column,
        endColumn: _$[_$.length - 1].last_column,
        text: $1,
      };
    }
  ;