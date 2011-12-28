%lex
%x t

%%

[^\x00]*?/("{{")            { this.begin("t"); if (yytext) return 'CONTENT'; }
[^\x00]+                    { return 'CONTENT'; }

<t>"{{#"                    { return 'OPEN_BLOCK'; }
<t>"{{/"                    { return 'OPEN_ENDBLOCK'; }
<t>"{{^"                    { return 'OPEN_INVERSE'; }
<t>"{{{"                    { return 'OPEN_UNESCAPED'; }
<t>"{{!"[\s\S]*?"}}"        { yytext = yytext.substr(3,yyleng-5); this.begin("INITIAL"); return 'COMMENT'; }
<t>"{{"                     { return 'OPEN'; }

<t>"."/[} ]                 { return 'ID'; }
<t>[.]                      { return 'SEP'; }
<t>\s+                      { /*ignore whitespace*/ }
<t>"}}}"                    { this.begin("INITIAL"); return 'CLOSE'; }
<t>"}}"                     { this.begin("INITIAL"); return 'CLOSE'; }
<t>[a-zA-Z0-9_$-]+/[=}\s\/.] { return 'ID'; }
<t>\[.*\]                   { yytext = yytext.substr(1, yyleng-2); return 'ID'; }
<t>.                        { return 'INVALID'; }

<INITIAL,t><<EOF>>          { return 'EOF'; }

/lex

%start root

%%

root
  : program EOF { return $1 }
  ;

program
  : statements { $$ = yy.newProgram($1) }
  | "" { $$ = yy.newProgram([]) }
  ;

statements
  : statement { $$ = [$1] }
  | statements statement { $1.push($2); $$ = $1 }
  ;

statement
  : openBlock program closeBlock { $$ = yy.newBlock($1, $2, $3) }
  | openInverse program closeBlock { $$ = yy.newInverse($1, $2, $3) }
  | mustache { $$ = $1 }
  | CONTENT { $$ = yy.newContent($1) }
  | COMMENT { $$ = yy.newComment($1) }
  ;

openBlock
  : OPEN_BLOCK path CLOSE { $$ = $2 }
  ;

openInverse
  : OPEN_INVERSE path CLOSE { $$ = $2 }
  ;

closeBlock
  : OPEN_ENDBLOCK path CLOSE { $$ = $2 }
  ;

mustache
  : OPEN path CLOSE { $$ = yy.newMustache($2, true) }
  | OPEN_UNESCAPED path CLOSE { $$ = yy.newMustache($2) }
  ;

path
  : pathSegments { $$ = yy.newName($1) }
  ;

pathSegments
  : pathSegments SEP ID { $1.push($3); $$ = $1; }
  | ID { $$ = [$1] }
  ;
