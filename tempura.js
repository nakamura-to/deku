/**
 * @preserve tempura - simple templating library in javascript.
 * https://github.com/nakamura-to/tempura
 */
/*jslint forin: true, indent:2, plusplus: true, vars: true */
/*global module:false, define:false */
//noinspection ThisExpressionReferencesGlobalObjectJS
(function (global) {
  'use strict';
  ////////////////////////////////////////////////
  /* Jison generated parser */
  var parser = (function(){

    var parser = {trace: function trace() { },
      yy: {},
      symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"statement":7,"openBlock":8,"closeBlock":9,"openInverse":10,"mustache":11,"CONTENT":12,"COMMENT":13,"OPEN_BLOCK":14,"path":15,"CLOSE":16,"OPEN_INVERSE":17,"OPEN_ENDBLOCK":18,"OPEN":19,"OPEN_UNESCAPED":20,"pathSegments":21,"SEP":22,"ID":23,"$accept":0,"$end":1},
      terminals_: {2:"error",5:"EOF",12:"CONTENT",13:"COMMENT",14:"OPEN_BLOCK",16:"CLOSE",17:"OPEN_INVERSE",18:"OPEN_ENDBLOCK",19:"OPEN",20:"OPEN_UNESCAPED",22:"SEP",23:"ID"},
      productions_: [0,[3,2],[4,1],[4,0],[6,1],[6,2],[7,3],[7,3],[7,1],[7,1],[7,1],[8,3],[10,3],[9,3],[11,3],[11,3],[15,1],[21,3],[21,1]],
      performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

        var $0 = $$.length - 1;
        switch (yystate) {
          case 1: return $$[$0-1]
            break;
          case 2: this.$ = yy.newProgram($$[$0])
            break;
          case 3: this.$ = yy.newProgram([])
            break;
          case 4: this.$ = [$$[$0]]
            break;
          case 5: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]
            break;
          case 6: this.$ = yy.newBlock($$[$0-2], $$[$0-1], $$[$0])
            break;
          case 7: this.$ = yy.newInverse($$[$0-2], $$[$0-1], $$[$0])
            break;
          case 8: this.$ = $$[$0]
            break;
          case 9: this.$ = yy.newContent($$[$0])
            break;
          case 10: this.$ = yy.newComment($$[$0])
            break;
          case 11: this.$ = $$[$0-1]
            break;
          case 12: this.$ = $$[$0-1]
            break;
          case 13: this.$ = $$[$0-1]
            break;
          case 14: this.$ = yy.newMustache($$[$0-1], true)
            break;
          case 15: this.$ = yy.newMustache($$[$0-1])
            break;
          case 16: this.$ = yy.newName($$[$0])
            break;
          case 17: $$[$0-2].push($$[$0]); this.$ = $$[$0-2];
            break;
          case 18: this.$ = [$$[$0]]
            break;
        }
      },
      table: [{3:1,4:2,5:[2,3],6:3,7:4,8:5,10:6,11:7,12:[1,8],13:[1,9],14:[1,10],17:[1,11],19:[1,12],20:[1,13]},{1:[3]},{5:[1,14]},{5:[2,2],7:15,8:5,10:6,11:7,12:[1,8],13:[1,9],14:[1,10],17:[1,11],18:[2,2],19:[1,12],20:[1,13]},{5:[2,4],12:[2,4],13:[2,4],14:[2,4],17:[2,4],18:[2,4],19:[2,4],20:[2,4]},{4:16,6:3,7:4,8:5,10:6,11:7,12:[1,8],13:[1,9],14:[1,10],17:[1,11],18:[2,3],19:[1,12],20:[1,13]},{4:17,6:3,7:4,8:5,10:6,11:7,12:[1,8],13:[1,9],14:[1,10],17:[1,11],18:[2,3],19:[1,12],20:[1,13]},{5:[2,8],12:[2,8],13:[2,8],14:[2,8],17:[2,8],18:[2,8],19:[2,8],20:[2,8]},{5:[2,9],12:[2,9],13:[2,9],14:[2,9],17:[2,9],18:[2,9],19:[2,9],20:[2,9]},{5:[2,10],12:[2,10],13:[2,10],14:[2,10],17:[2,10],18:[2,10],19:[2,10],20:[2,10]},{15:18,21:19,23:[1,20]},{15:21,21:19,23:[1,20]},{15:22,21:19,23:[1,20]},{15:23,21:19,23:[1,20]},{1:[2,1]},{5:[2,5],12:[2,5],13:[2,5],14:[2,5],17:[2,5],18:[2,5],19:[2,5],20:[2,5]},{9:24,18:[1,25]},{9:26,18:[1,25]},{16:[1,27]},{16:[2,16],22:[1,28]},{16:[2,18],22:[2,18]},{16:[1,29]},{16:[1,30]},{16:[1,31]},{5:[2,6],12:[2,6],13:[2,6],14:[2,6],17:[2,6],18:[2,6],19:[2,6],20:[2,6]},{15:32,21:19,23:[1,20]},{5:[2,7],12:[2,7],13:[2,7],14:[2,7],17:[2,7],18:[2,7],19:[2,7],20:[2,7]},{12:[2,11],13:[2,11],14:[2,11],17:[2,11],18:[2,11],19:[2,11],20:[2,11]},{23:[1,33]},{12:[2,12],13:[2,12],14:[2,12],17:[2,12],18:[2,12],19:[2,12],20:[2,12]},{5:[2,14],12:[2,14],13:[2,14],14:[2,14],17:[2,14],18:[2,14],19:[2,14],20:[2,14]},{5:[2,15],12:[2,15],13:[2,15],14:[2,15],17:[2,15],18:[2,15],19:[2,15],20:[2,15]},{16:[1,34]},{16:[2,17],22:[2,17]},{5:[2,13],12:[2,13],13:[2,13],14:[2,13],17:[2,13],18:[2,13],19:[2,13],20:[2,13]}],
      defaultActions: {14:[2,1]},
      parseError: function parseError(str, hash) {
        throw new Error(str);
      },
      parse: function parse(input) {
        var self = this,
          stack = [0],
          vstack = [null], // semantic value stack
          lstack = [], // location stack
          table = this.table,
          yytext = '',
          yylineno = 0,
          yyleng = 0,
          recovering = 0,
          TERROR = 2,
          EOF = 1;

        //this.reductionCount = this.shiftCount = 0;

        this.lexer.setInput(input);
        this.lexer.yy = this.yy;
        this.yy.lexer = this.lexer;
        if (typeof this.lexer.yylloc == 'undefined')
          this.lexer.yylloc = {};
        var yyloc = this.lexer.yylloc;
        lstack.push(yyloc);

        if (typeof this.yy.parseError === 'function')
          this.parseError = this.yy.parseError;

        function popStack (n) {
          stack.length = stack.length - 2*n;
          vstack.length = vstack.length - n;
          lstack.length = lstack.length - n;
        }

        function lex() {
          var token;
          token = self.lexer.lex() || 1; // $end = 1
          // if token isn't its numeric value, convert
          if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
          }
          return token;
        }

        var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
        while (true) {
          // retreive state number from top of stack
          state = stack[stack.length-1];

          // use default actions if available
          if (this.defaultActions[state]) {
            action = this.defaultActions[state];
          } else {
            if (symbol == null)
              symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
          }

          // handle parse error
          _handle_error:
            if (typeof action === 'undefined' || !action.length || !action[0]) {

              if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                  expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                  errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                  errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                    (symbol == 1 /*EOF*/ ? "end of input" :
                      ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                  {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
              }

              // just recovered from another error
              if (recovering == 3) {
                if (symbol == EOF) {
                  throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
              }

              // try to recover from error
              while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                  break;
                }
                if (state == 0) {
                  throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
              }

              preErrorSymbol = symbol; // save the lookahead token
              symbol = TERROR;         // insert generic error symbol as new lookahead
              state = stack[stack.length-1];
              action = table[state] && table[state][TERROR];
              recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
            }

          // this shouldn't happen, unless resolve defaults are off
          if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
          }

          switch (action[0]) {

            case 1: // shift
              //this.shiftCount++;

              stack.push(symbol);
              vstack.push(this.lexer.yytext);
              lstack.push(this.lexer.yylloc);
              stack.push(action[1]); // push state
              symbol = null;
              if (!preErrorSymbol) { // normal execution/no error
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                  recovering--;
              } else { // error just occurred, resume old lookahead f/ before error
                symbol = preErrorSymbol;
                preErrorSymbol = null;
              }
              break;

            case 2: // reduce
              //this.reductionCount++;

              len = this.productions_[action[1]][1];

              // perform semantic action
              yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
              // default location, uses first token for firsts, last for lasts
              yyval._$ = {
                first_line: lstack[lstack.length-(len||1)].first_line,
                last_line: lstack[lstack.length-1].last_line,
                first_column: lstack[lstack.length-(len||1)].first_column,
                last_column: lstack[lstack.length-1].last_column
              };
              r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

              if (typeof r !== 'undefined') {
                return r;
              }

              // pop off stack
              if (len) {
                stack = stack.slice(0,-1*len*2);
                vstack = vstack.slice(0, -1*len);
                lstack = lstack.slice(0, -1*len);
              }

              stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              // goto new state = table[STATE][NONTERMINAL]
              newState = table[stack[stack.length-2]][stack[stack.length-1]];
              stack.push(newState);
              break;

            case 3: // accept
              return true;
          }

        }

        return true;
      }};/* Jison generated lexer */
    var lexer = (function(){

      var lexer = ({EOF:1,
        parseError:function parseError(str, hash) {
          if (this.yy.parseError) {
            this.yy.parseError(str, hash);
          } else {
            throw new Error(str);
          }
        },
        setInput:function (input) {
          this._input = input;
          this._more = this._less = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
          return this;
        },
        input:function () {
          var ch = this._input[0];
          this.yytext+=ch;
          this.yyleng++;
          this.match+=ch;
          this.matched+=ch;
          var lines = ch.match(/\n/);
          if (lines) this.yylineno++;
          this._input = this._input.slice(1);
          return ch;
        },
        unput:function (ch) {
          this._input = ch + this._input;
          return this;
        },
        more:function () {
          this._more = true;
          return this;
        },
        pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
        },
        upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
        },
        showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c+"^";
        },
        next:function () {
          if (this.done) {
            return this.EOF;
          }
          if (!this._input) this.done = true;

          var token,
            match,
            col,
            lines;
          if (!this._more) {
            this.yytext = '';
            this.match = '';
          }
          var rules = this._currentRules();
          for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
              lines = match[0].match(/\n.*/g);
              if (lines) this.yylineno += lines.length;
              this.yylloc = {first_line: this.yylloc.last_line,
                last_line: this.yylineno+1,
                first_column: this.yylloc.last_column,
                last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
              this.yytext += match[0];
              this.match += match[0];
              this.matches = match;
              this.yyleng = this.yytext.length;
              this._more = false;
              this._input = this._input.slice(match[0].length);
              this.matched += match[0];
              token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
              if (token) return token;
              else return;
            }
          }
          if (this._input === "") {
            return this.EOF;
          } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
              {text: "", token: null, line: this.yylineno});
          }
        },
        lex:function lex() {
          var r = this.next();
          if (typeof r !== 'undefined') {
            return r;
          } else {
            return this.lex();
          }
        },
        begin:function begin(condition) {
          this.conditionStack.push(condition);
        },
        popState:function popState() {
          return this.conditionStack.pop();
        },
        _currentRules:function _currentRules() {
          return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
        },
        topState:function () {
          return this.conditionStack[this.conditionStack.length-2];
        },
        pushState:function begin(condition) {
          this.begin(condition);
        }});
      lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

        var YYSTATE=YY_START
        switch($avoiding_name_collisions) {
          case 0: this.begin("t"); if (yy_.yytext) return 12;
            break;
          case 1: return 12;
            break;
          case 2: return 14;
            break;
          case 3: return 18;
            break;
          case 4: return 17;
            break;
          case 5: return 20;
            break;
          case 6: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.begin("INITIAL"); return 13;
            break;
          case 7: return 19;
            break;
          case 8: return 23;
            break;
          case 9: return 22;
            break;
          case 10: /*ignore whitespace*/
            break;
          case 11: this.begin("INITIAL"); return 16;
            break;
          case 12: this.begin("INITIAL"); return 16;
            break;
          case 13: return 23;
            break;
          case 14: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 23;
            break;
          case 15: return 'INVALID';
            break;
          case 16: return 5;
            break;
        }
      };
      lexer.rules = [/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\{/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^\.(?=[} ])/,/^[.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^[a-zA-Z0-9_$-]+(?=[=}\s\/.])/,/^\[.*\]/,/^./,/^$/];
      lexer.conditions = {"t":{"rules":[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],"inclusive":false},"INITIAL":{"rules":[0,1,16],"inclusive":true}};return lexer;})()
    parser.lexer = lexer;
    return parser;
  })();
  if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
    exports.parser = parser;
    exports.parse = function () { return parser.parse.apply(parser, arguments); }
    exports.main = function commonjsMain(args) {
      if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
      if (typeof process !== 'undefined') {
        var source = require("fs").readFileSync(require("path").join(process.cwd(), args[1]), "utf8");
      } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
      }
      return exports.parser.parse(source);
    }
    if (typeof module !== 'undefined' && require.main === module) {
      exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
    }
  }
  ////////////////////////////////////////////////

  var undef;

  var util = {

    toString: Object.prototype.toString,

    slice: Array.prototype.slice,

    isObject: function (obj) {
      var toObject = Object;
      return obj === toObject(obj);
    },

    isPlainObject: function (obj) {
      return util.toString.call(obj) === '[object Object]';
    },

    isArray: function (obj) {
      return util.toString.call(obj) === '[object Array]';
    },

    isFunction: function (obj) {
      return util.toString.call(obj) === '[object Function]';
    },

    isString: function (obj) {
      return util.toString.call(obj) === '[object String]';
    },

    trim: function (s) {
      if (s === null || s === undef) {
        return '';
      }
      return s.replace(/^\s+/, '').replace(/\s+$/, '');
    },

    extend: function (target) {
      var args = util.slice.call(arguments, 1);
      var len = args.length;
      var i;
      var source;
      var key;
      if (target === null || target === undef || len === 0) {
        return target;
      }
      for (i = 0; i < len; i++) {
        source = args[i];
        if (source !== null && source !== undef) {
          for (key in source) {
            if (target[key] === undef) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    },

    deepExtend: function (target) {
      var args = util.slice.call(arguments, 1);
      var len = args.length;
      var i;
      var source;
      var mergeRec;
      if (target === null || target === undef || len === 0) {
        return target;
      }
      mergeRec = function (target, source) {
        var key;
        var sourceProp;
        var targetProp;
        var newProp;
        for (key in source) {
          sourceProp = source[key];
          targetProp = target[key];
          var isArray = util.isArray(sourceProp);
          if (isArray || util.isPlainObject(sourceProp)) {
            newProp = targetProp || (isArray ? [] : {});
            mergeRec(newProp, sourceProp);
            target[key] = newProp;
          } else if (targetProp === undef) {
            target[key] = sourceProp;
          }
        }
      };
      for (i = 0; i < len; i++) {
        source = args[i];
        if (source !== null && source !== undef) {
          mergeRec(target, source);
        }
      }
      return target;
    },

    encode: function (html) {
      html = (html === null || html === undef) ? '' : String(html);
      return html.replace(/[&"'<>]/g, function (s) {
        switch (s) {
          case '&': return '&amp;';
          case '"': return '&quot;';
          case "'": return '&#39;';
          case '<': return '&lt;';
          case '>': return '&gt;';
          default: return s;
        }
      });
    }

  };

  var ast = {
    newProgram: function (statements) {
      return {
        type: 'type_program',
        statements: statements
      };
    },

    newBlock: function (name, program, close) {
      // TODO verify
      return {
        type: 'type_block',
        name: name,
        program: program
      };
    },

    newInverse: function (name, program, close) {
      // TODO verify
      return {
        type: 'type_inverse',
        name: name,
        program: program
      };
    },

    newContent: function (content) {
      return {
        type: 'type_content',
        content: content
      };
    },

    newComment: function (comment) {
      return {
        type: 'type_comment',
        comment: comment
      };
    },

    newMustache: function (name, escape) {
      return {
        type: 'type_mustache',
        name: name,
        escape: escape
      };
    },

    newName: function (segments) {
      var i;
      var len = segments.length;
      var strings = [];
      for (i = 0; i < len; i++) {
        strings.push(segments[i]);
      }
      return {
        type: 'type_name',
        segments: strings,
        isSimple: strings.length === 1
      };
    }
  };

  var compiler = (function () {
    var Compiler;
    var JsCompiler;

    Compiler = function (program) { 
      this.program = program;
      this.opcodes = [];
      this.children = [];
    };
    Compiler.OPCODE_PARAMLENGTH_MAP = {
      op_append: 0,
      op_appendContent: 1,
      op_escape: 0,
      op_lookupFromContext: 1,
      op_lookupFromStack: 1,
      op_invokeProgram: 1,
      op_invokeProgramInverse: 1
    };
    Compiler.prototype = {

      guid: 0,

      compile: function () {
        var statements = this.program.statements;
        var statement;
        var i;
        var len = statements.length;
        for (i = 0; i < len; i++) {
          statement = statements[i];
          this[statement.type](statement);
        }
        return this;
      },
      
      compileProgram: function (program) {
        var compiler = new Compiler(program);
        var guid = this.guid++;
        this.children[guid] = compiler.compile();
        return guid;
      },

      pushOpcode: function (name, param) {
        this.opcodes.push(name);
        if (param !== undef) {
          this.opcodes.push(param);
        }
      },

      type_block : function (node) {
        var guid;
        this.type_name(node.name);
        guid = this.compileProgram(node.program);
        this.pushOpcode('op_invokeProgram', guid);
        this.pushOpcode('op_append');
      },

      type_inverse: function (node) {
        var guid;
        this.type_name(node.name);
        guid = this.compileProgram(node.program);
        this.pushOpcode('op_invokeProgramInverse', guid);
        this.pushOpcode('op_append');
      },

      type_content: function (node) {
        this.pushOpcode('op_appendContent', node.content);
      },

      type_comment: function () {
      },

      type_mustache: function (node) {
        this.type_name(node.name);
        //this.opcode('op_invokeMustache');
        if (node.escape) {
          this.pushOpcode('op_escape');
        }
        this.pushOpcode('op_append');
      },

      type_name: function (node) {
        var segments = node.segments;
        var i;
        var len = segments.length;
        this.pushOpcode('op_lookupFromContext', segments[0]);
        for (i = 1; i < len; i++) {
          this.pushOpcode('op_lookupFromStack', segments[i]);
        }
      }

    };

    JsCompiler = function (environment, jscContext) {
      this.environment = environment;
      this.name = environment.name;
      this.source = [''];
      this.stackSlot = 0;
      this.stackVars = [];
      this.isChild = !!jscContext;
      this.renderContext = jscContext || {
        programs: []
      };
    };
    JsCompiler.prototype = {

      nameLookup: function (contextVar, name) {
        return contextVar + '["' + name + '"]';
      },

      appendToBuffer: function (s) {
        this.source.push('buffer += ' + s + ';');
      },
      
      quoteString: function (s) {
        s = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        return '"' + s + '"'
      },

      compileChildren: function () {
        var envChildren = this.environment.children;
        var envChild;
        var jsc;
        var i;
        var len = envChildren.length;
        var index;
        for (i = 0; i < len; i++) {
          envChild = envChildren[i];
          this.renderContext.programs.push('');
          index = this.renderContext.programs.length;
          envChild.index = index;
          envChild.name = 'program' + index;
          jsc = new JsCompiler(envChild, this.renderContext);
          this.renderContext.programs[index] = jsc.compile(false);
        }
      },

      execOpcodes: function () {
        var opcodes = this.environment.opcodes;
        var i;
        var len = opcodes.length;
        var opcode;
        var j;
        var paramLen;
        var params;
        for (i = 0; i < len;) {
          opcode = opcodes[i];
          params = [];
          paramLen = Compiler.OPCODE_PARAMLENGTH_MAP[opcode];
          for (i++, j = 0; j < paramLen && i < len; i++, j++) {
            params.push(opcodes[i + j]);
          }
          this[opcode].apply(this, params);
        }
      },

      generateJs: function (asObject) {
        var indent = this.isChild ? '  ' : '';
        var body;
        var expr;
        if (this.stackVars.length > 0) {
          this.source[0] += ', ' + this.stackVars.join(', ');
        }
        if (this.isChild) {
          this.source[0] += ", buffer = ''";
        } else {
          this.source[0] += ", buffer = '', undef, escape = this.escape, handleBlock = this.handleBlock, handleInverse = this.handleInverse";
        }
        if (this.source[0]) {
          this.source[0] = 'var' + this.source[0].slice(1) + ';';
        }
        if (!this.isChild) {
          this.source[0] += '\n' + this.renderContext.programs.join('\n') + '\n';
        }
        this.source.push('return buffer;');
        body = '  ' + indent + this.source.join('\n  ' + indent);
        if (asObject) {
          return new Function('context', body);
        } else {
          expr = indent + 'function ' + (this.name || '') + ' (context) {\n' + body + '\n'+ indent + '}';
          return expr;
        }
      },

      compile: function (asObject) {
        this.compileChildren();
        this.execOpcodes();
        return this.generateJs(asObject);
      },

      expandStack: function () {
        var name;
        this.stackSlot++;
        name = 'stack' + this.stackSlot;
        if (this.stackSlot > this.stackVars.length) {
          this.stackVars.push(name)
        }
        return name;
      },

      shrinkStack: function () {
        this.stackSlot--;
      },

      currentStack: function () {
        return 'stack' + this.stackSlot;
      },

      assign: function (expr) {
        var stack = this.currentStack();
        this.source.push(stack + ' = ' + expr + ';');
      },

      op_invokeProgram: function (guid) {
        var stack = this.currentStack();
        var envChild = this.environment.children[guid];
        var expr = 'handleBlock(context, ' + stack + ', ' + envChild.name + ')';
        this.assign(expr);
      },

      op_invokeProgramInverse: function (guid) {
        var stack = this.currentStack();
        var envChild = this.environment.children[guid];
        var expr = 'handleInverse(context, ' + stack + ', ' + envChild.name + ')';
        this.assign(expr);
      },

      op_invokeMustache: function () {
        // todo unnecessary ?
      },

      op_escape: function () {
        var stack = this.currentStack();
        var expr = 'escape(' + stack + ')';
        this.assign(expr);
      },

      op_append: function () {
        var stack = this.currentStack();
        this.appendToBuffer(stack);
        this.shrinkStack();
      },

      op_appendContent: function (content) {
        var content = this.quoteString(content);
        this.appendToBuffer(content);
      },

      op_lookupFromContext: function (name) {
        var expr = name === '$this' ? 'context': this.nameLookup('context', name);
        this.expandStack();
        this.assign(expr);
      },

      op_lookupFromStack: function (name) {
        var expr;
        var stack = this.currentStack();
        if (name === '$this') {
          expr = stack;
        } else {
          expr = '(' + stack + ' === null || ' + stack + ' === undef) ? '
            + stack + ' : ' + this.nameLookup(stack, name) + ';';
        }
        this.assign(expr);
      }
    };

    var compile = function (template, templateContext) {
      var program = parser.parse(template);
      var compiler = new Compiler(program);
      var environment = compiler.compile(program);
      var jsCompiler = new JsCompiler(environment);
      return jsCompiler.compile(true);
    };

    parser.yy = ast;

    return {
      Compiler: Compiler,
      JsCompiler: JsCompiler,
      compile: compile
    };
  }());

  var core = {

    handleBlock: function (context, value, fn) {
      var result = '';
      var i;
      var len;
      var array = [];
      if (util.isArray(value)) {
        len = value.length;
        for (i = 0; i < len; i++) {
          array[i] = fn(value[i]);
        }
        result = array.join('');
      } else if (util.isFunction(value)) {
        if (value.call(context)) {
          result = fn(context);
        }
      } else if (util.isObject(value)) {
        result = fn(value);
      } else if (value) {
        result = fn(context);
      }
      return result;
    },

    handleInverse: function (context, value, fn) {
      var result = '';
      if (!value) {
        result = fn(context);
      } else if (util.isFunction(value)) {
        if (!value.call(context)) {
          result = fn(context);
        }
      } else if ((util.isArray(value) && value.length === 0)) {
        result = fn(context);
      }
      return result;
    },

    prepare: function (template, options) {
      var renderContext = {
        escape: tempura.internal.util.encode,
        handleBlock: tempura.internal.core.handleBlock,
        handleInverse: tempura.internal.core.handleInverse
      };
      var compiledTemplate = compiler.compile(template);
      return {
        render: function (data) {
          return compiledTemplate.call(renderContext, data);
        }
      };
    }

  };

  var tempura =  (function () {

    var undef;

    //noinspection JSUnusedLocalSymbols
    var defaultSettings = {
      otag: core.OTAG,
      ctag: core.CTAG,
      preserveUnknownTags: false,
      pipes: {},
      preRender: function (value, pipe) {
        var result = pipe(value);
        return result === undef ? '' : result;
      },
      noSuchValue: function (name) {
        return undef;
      },
      noSuchPipe: function (name, index, value) {
        return value;
      }
    };

    var settings = util.deepExtend({}, defaultSettings);

    return {
      name: 'tempura',

      version: '0.0.2',

      getSettings: function () {
        return settings;
      },

      setSettings: function (userSettings) {
        settings = userSettings;
      },

      mergeSettings: function (userSettings) {
        settings = util.deepExtend({}, userSettings, settings);
      },

      prepare: function (template, options) {
        options = util.deepExtend({}, options, settings);
        return core.prepare(template, options);
      },

      internal: {
        util: util,
        ast: ast,
        parser: parser,
        compiler: compiler,
        core: core
      }
    };
  }());

  if (typeof module !== 'undefined') {
    module.exports = tempura;
  } else if (typeof define === 'function' && define.amd) {
    define('tempura', function () {
      return tempura;
    });
  } else {
    global.tempura = tempura;
  }

}(this));