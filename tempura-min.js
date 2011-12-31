// tempura.js 0.0.3
// tempura is simple templating library in javascript.
// For all details and documentation:
// http://nakamura-to.github.com/tempura/
//noinspection ThisExpressionReferencesGlobalObjectJS
(function(a){"use strict";var b=function(){var a={parse:function(a,c){function j(a,b,c){var d=a,e=c-a.length;for(var f=0;f<e;f++)d=b+d;return d}function k(a){var b=a.charCodeAt(0);if(b<=255)var c="x",d=2;else var c="u",d=4;return"\\"+c+j(b.toString(16).toUpperCase(),"0",d)}function l(a){return'"'+a.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/[\x80-\uFFFF]/g,k)+'"'}function m(a){if(e<g)return;e>g&&(g=e,h=[]),h.push(a)}function n(){var b="Program@"+e,c=i[b];if(c)return e=c.nextPos,c.result;var d=e,g=e,h=o();if(h!==null){var j=[],k=o();while(k!==null){j.push(k);var k=o()}if(j!==null)var l=[h,j];else{var l=null;e=g}}else{var l=null;e=g}var n=l!==null?function(a,b){var c=[a],d,e=b.length;for(d=0;d<e;d++)c.push(b[d]);return{type:"type_program",statements:c}}(l[0],l[1]):null;if(n!==null)var p=n;else{var p=null;e=d}if(p!==null)var q=p;else{var r=e;if(a.substr(e,0)===""){var s="";e+=0}else{var s=null;f&&m('""')}var t=s!==null?function(){return{type:"type_program",statements:[]}}():null;if(t!==null)var u=t;else{var u=null;e=r}if(u!==null)var q=u;else var q=null}return i[b]={nextPos:e,result:q},q}function o(){var a="Statement@"+e,b=i[a];if(b)return e=b.nextPos,b.result;var c=p();if(c!==null)var d=c;else{var f=q();if(f!==null)var d=f;else{var g=r();if(g!==null)var d=g;else{var h=t();if(h!==null)var d=h;else{var j=u();if(j!==null)var d=j;else var d=null}}}}return i[a]={nextPos:e,result:d},d}function p(){var b="Block@"+e,c=i[b];if(c)return e=c.nextPos,c.result;var d=e,g=e;if(a.substr(e,3)==="{{#"){var h="{{#";e+=3}else{var h=null;f&&m('"{{#"')}if(h!==null){var j=x();if(j!==null){var k=v();if(k!==null){var l=x();if(l!==null){if(a.substr(e,2)==="}}"){var o="}}";e+=2}else{var o=null;f&&m('"}}"')}if(o!==null){var p=n();if(p!==null){if(a.substr(e,3)==="{{/"){var q="{{/";e+=3}else{var q=null;f&&m('"{{/"')}if(q!==null){var r=x();if(r!==null){var s=v();if(s!==null){var t=x();if(t!==null){if(a.substr(e,2)==="}}"){var u="}}";e+=2}else{var u=null;f&&m('"}}"')}if(u!==null)var w=[h,j,k,l,o,p,q,r,s,t,u];else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}var y=w!==null?function(a,b,c){return B(a,c),{type:"type_block",name:a,program:b}}(w[2],w[5],w[8]):null;if(y!==null)var z=y;else{var z=null;e=d}return i[b]={nextPos:e,result:z},z}function q(){var b="Inverse@"+e,c=i[b];if(c)return e=c.nextPos,c.result;var d=e,g=e;if(a.substr(e,3)==="{{^"){var h="{{^";e+=3}else{var h=null;f&&m('"{{^"')}if(h!==null){var j=x();if(j!==null){var k=v();if(k!==null){var l=x();if(l!==null){if(a.substr(e,2)==="}}"){var o="}}";e+=2}else{var o=null;f&&m('"}}"')}if(o!==null){var p=n();if(p!==null){if(a.substr(e,3)==="{{/"){var q="{{/";e+=3}else{var q=null;f&&m('"{{/"')}if(q!==null){var r=x();if(r!==null){var s=v();if(s!==null){var t=x();if(t!==null){if(a.substr(e,2)==="}}"){var u="}}";e+=2}else{var u=null;f&&m('"}}"')}if(u!==null)var w=[h,j,k,l,o,p,q,r,s,t,u];else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}}else{var w=null;e=g}var y=w!==null?function(a,b,c){return B(a,c),{type:"type_inverse",name:a,program:b}}(w[2],w[5],w[8]):null;if(y!==null)var z=y;else{var z=null;e=d}return i[b]={nextPos:e,result:z},z}function r(){var b="Mustache@"+e,c=i[b];if(c)return e=c.nextPos,c.result;var d=e,g=e;if(a.substr(e,2)==="{{"){var h="{{";e+=2}else{var h=null;f&&m('"{{"')}if(h!==null){var j=x();if(j!==null){var k=v();if(k!==null){var l=s();if(l!==null){var n=x();if(n!==null){if(a.substr(e,2)==="}}"){var o="}}";e+=2}else{var o=null;f&&m('"}}"')}if(o!==null)var p=[h,j,k,l,n,o];else{var p=null;e=g}}else{var p=null;e=g}}else{var p=null;e=g}}else{var p=null;e=g}}else{var p=null;e=g}}else{var p=null;e=g}var q=p!==null?function(a,b){return{type:"type_mustache",name:a,pipes:b,escape:!0}}(p[2],p[3]):null;if(q!==null)var r=q;else{var r=null;e=d}if(r!==null)var t=r;else{var u=e,w=e;if(a.substr(e,3)==="{{{"){var y="{{{";e+=3}else{var y=null;f&&m('"{{{"')}if(y!==null){var z=x();if(z!==null){var A=v();if(A!==null){var B=s();if(B!==null){var C=x();if(C!==null){if(a.substr(e,3)==="}}}"){var D="}}}";e+=3}else{var D=null;f&&m('"}}}"')}if(D!==null)var E=[y,z,A,B,C,D];else{var E=null;e=w}}else{var E=null;e=w}}else{var E=null;e=w}}else{var E=null;e=w}}else{var E=null;e=w}}else{var E=null;e=w}var F=E!==null?function(a,b){return{type:"type_mustache",name:a,pipes:b,escape:!1}}(E[2],E[3]):null;if(F!==null)var G=F;else{var G=null;e=u}if(G!==null)var t=G;else var t=null}return i[b]={nextPos:e,result:t},t}function s(){var b="Pipes@"+e,c=i[b];if(c)return e=c.nextPos,c.result;var d=e,g=[],h=e,j=x();if(j!==null){if(a.substr(e,1)==="|"){var k="|";e+=1}else{var k=null;f&&m('"|"')}if(k!==null){var l=x();if(l!==null){var n=w();if(n!==null)var o=[j,k,l,n];else{var o=null;e=h}}else{var o=null;e=h}}else{var o=null;e=h}}else{var o=null;e=h}while(o!==null){g.push(o);var h=e,j=x();if(j!==null){if(a.substr(e,1)==="|"){var k="|";e+=1}else{var k=null;f&&m('"|"')}if(k!==null){var l=x();if(l!==null){var n=w();if(n!==null)var o=[j,k,l,n];else{var o=null;e=h}}else{var o=null;e=h}}else{var o=null;e=h}}else{var o=null;e=h}}var p=g!==null?function(a){var b=[],c,d=a.length;for(c=0;c<d;c++)b.push(a[c][3]);return b}(g):null;if(p!==null)var q=p;else{var q=null;e=d}if(q!==null)var r=q;else{var s=e,t=e,u=[],v=u!==null?function(){return[]}():null;if(v!==null)var y=v;else{var y=null;e=s}if(y!==null)var r=y;else var r=null}return i[b]={nextPos:e,result:r},r}function t(){var b="Comment@"+e,c=i[b];if(c)return e=c.nextPos,c.result;var d=e,g=e;if(a.substr(e,3)==="{{!"){var h="{{!";e+=3}else{var h=null;f&&m('"{{!"')}if(h!==null){var j=[],k=e,l=e,n=f;f=!1;if(a.substr(e,2)==="}}"){var o="}}";e+=2}else{var o=null;f&&m('"}}"')}f=n;if(o===null)var p="";else{var p=null;e=l}if(p!==null){if(a.length>e){var q=a.charAt(e);e++}else{var q=null;f&&m("any character")}if(q!==null)var r=[p,q];else{var r=null;e=k}}else{var r=null;e=k}while(r!==null){j.push(r);var k=e,l=e,n=f;f=!1;if(a.substr(e,2)==="}}"){var o="}}";e+=2}else{var o=null;f&&m('"}}"')}f=n;if(o===null)var p="";else{var p=null;e=l}if(p!==null){if(a.length>e){var q=a.charAt(e);e++}else{var q=null;f&&m("any character")}if(q!==null)var r=[p,q];else{var r=null;e=k}}else{var r=null;e=k}}if(j!==null){if(a.substr(e,2)==="}}"){var s="}}";e+=2}else{var s=null;f&&m('"}}"')}if(s!==null)var t=[h,j,s];else{var t=null;e=g}}else{var t=null;e=g}}else{var t=null;e=g}var u=t!==null?function(a){var b=[],c,d=a.length;for(c=0;c<d;c++)b.push(a[c][1]);return{type:"type_comment",comment:b.join("")}}(t[1]):null;if(u!==null)var v=u;else{var v=null;e=d}return i[b]={nextPos:e,result:v},v}function u(){var b="Content@"+e,c=i[b];if(c)return e=c.nextPos,c.result;var d=e,g=e,h=e,j=f;f=!1;if(a.substr(e,2)==="{{"){var k="{{";e+=2}else{var k=null;f&&m('"{{"')}f=j;if(k===null)var l="";else{var l=null;e=h}if(l!==null){if(a.length>e){var n=a.charAt(e);e++}else{var n=null;f&&m("any character")}if(n!==null)var o=[l,n];else{var o=null;e=g}}else{var o=null;e=g}if(o!==null){var p=[];while(o!==null){p.push(o);var g=e,h=e,j=f;f=!1;if(a.substr(e,2)==="{{"){var k="{{";e+=2}else{var k=null;f&&m('"{{"')}f=j;if(k===null)var l="";else{var l=null;e=h}if(l!==null){if(a.length>e){var n=a.charAt(e);e++}else{var n=null;f&&m("any character")}if(n!==null)var o=[l,n];else{var o=null;e=g}}else{var o=null;e=g}}}else var p=null;var q=p!==null?function(a){var b=[],c,d=a.length;for(c=0;c<d;c++)b.push(a[c][1]);return{type:"type_content",content:b.join("")}}(p):null;if(q!==null)var r=q;else{var r=null;e=d}return i[b]={nextPos:e,result:r},r}function v(){var b="Path@"+e,c=i[b];if(c)return e=c.nextPos,c.result;var d=e,g=e,h=w();if(h!==null){var j=[],k=e;if(a.substr(e,1)==="."){var l=".";e+=1}else{var l=null;f&&m('"."')}if(l!==null){var n=w();if(n!==null)var o=[l,n];else{var o=null;e=k}}else{var o=null;e=k}while(o!==null){j.push(o);var k=e;if(a.substr(e,1)==="."){var l=".";e+=1}else{var l=null;f&&m('"."')}if(l!==null){var n=w();if(n!==null)var o=[l,n];else{var o=null;e=k}}else{var o=null;e=k}}if(j!==null)var p=[h,j];else{var p=null;e=g}}else{var p=null;e=g}var q=p!==null?function(a,b){var c=[a],d,e=b.length;for(d=0;d<e;d++)c.push(b[d][1]);return{type:"type_name",path:c.join("."),segments:c,isSimple:c.length===1}}(p[0],p[1]):null;if(q!==null)var r=q;else{var r=null;e=d}return i[b]={nextPos:e,result:r},r}function w(){var b="Id@"+e,c=i[b];if(c)return e=c.nextPos,c.result;var d=e;if(a.substr(e).match(/^[a-zA-Z0-9_$-%@!]/)!==null){var g=a.charAt(e);e++}else{var g=null;f&&m("[a-zA-Z0-9_$-%@!]")}if(g!==null){var h=[];while(g!==null){h.push(g);if(a.substr(e).match(/^[a-zA-Z0-9_$-%@!]/)!==null){var g=a.charAt(e);e++}else{var g=null;f&&m("[a-zA-Z0-9_$-%@!]")}}}else var h=null;var j=h!==null?function(a){return a.join("")}(h):null;if(j!==null)var k=j;else{var k=null;e=d}return i[b]={nextPos:e,result:k},k}function x(){var a="_@"+e,b=i[a];if(b)return e=b.nextPos,b.result;var c=[],d=y();while(d!==null){c.push(d);var d=y()}return i[a]={nextPos:e,result:c},c}function y(){var b="Whitespace@"+e,c=i[b];if(c)return e=c.nextPos,c.result;if(a.substr(e).match(/^[ 	\n\r]/)!==null){var d=a.charAt(e);e++}else{var d=null;f&&m("[ \t\\n\\r]")}return i[b]={nextPos:e,result:d},d}function z(){function b(a){a.sort();var b=null,c=[];for(var d=0;d<a.length;d++)a[d]!==b&&(c.push(a[d]),b=a[d]);switch(c.length){case 0:return"end of input";case 1:return c[0];default:return c.slice(0,c.length-1).join(", ")+" or "+c[c.length-1]}}var c=b(h),d=Math.max(e,g),f=d<a.length?l(a.charAt(d)):"end of input";return"Expected "+c+" but "+f+" found."}function A(){var b=1,c=1,d=!1;for(var e=0;e<g;e++){var f=a.charAt(e);f==="\n"?(d||b++,c=1,d=!1):f==="\r"|f==="\u2028"||f==="\u2029"?(b++,c=1,d=!0):(c++,d=!1)}return{line:b,column:c}}function B(a,c){if(a.path!==c.path){var d=A();throw new b.SyntaxError(a.path+" doesn't match "+c.path,d.line,d.column)}}var d={Block:p,Comment:t,Content:u,Id:w,Inverse:q,Mustache:r,Path:v,Pipes:s,Program:n,Statement:o,Whitespace:y,_:x};if(c!==undefined){if(d[c]===undefined)throw new Error("Invalid rule name: "+l(c)+".")}else c="Program";var e=0,f=!0,g=0,h=[],i={},C=d[c]();if(C===null||e!==a.length){var D=A();throw new this.SyntaxError(z(),D.line,D.column)}return C},toSource:function(){return this._source}};return a.SyntaxError=function(a,b,c){this.name="SyntaxError",this.message=a,this.line=b,this.column=c},a.SyntaxError.prototype=Error.prototype,a}(),c,d={toString:Object.prototype.toString,slice:Array.prototype.slice,isObject:function(a){var b=Object;return a===b(a)},isArray:function(a){return d.toString.call(a)==="[object Array]"},isFunction:function(a){return d.toString.call(a)==="[object Function]"},extend:function(a){var b=d.slice.call(arguments,1),e=b.length,f,g,h;if(a===null||a===c||e===0)return a;for(f=0;f<e;f++){g=b[f];if(g!==null&&g!==c)for(h in g)a[h]===c&&(a[h]=g[h])}return a},escape:function(a){return a=a===null||a===c?"":String(a),a.replace(/[&"'<>]/g,function(a){switch(a){case"&":return"&amp;";case'"':return"&quot;";case"'":return"&#39;";case"<":return"&lt;";case">":return"&gt;";default:return a}})}},e=function(){var a,d;a=function(a,b){this.program=a,this.opcodes=[],this.context=b||{allEnvironments:[]},this.index=this.context.allEnvironments.length,this.name="program"+this.index,this.context.allEnvironments.push(this)},a.OPCODE_PARAMLENGTH_MAP={op_append:0,op_appendContent:1,op_applyPipe:2,op_applyPrePipeProcess:1,op_applyPostPipeProcess:1,op_escape:0,op_evaluateValue:1,op_lookupFromContext:1,op_lookupFromStack:1,op_invokeProgram:1,op_invokeProgramInverse:1},a.prototype={compile:function(){var a=this.program.statements,b,c,d=a.length;for(c=0;c<d;c++)b=a[c],this[b.type](b);return this},compileProgram:function(b){var c=new a(b,this.context);return c.compile()},pushOpcode:function(a,b,d){this.opcodes.push(a),b!==c&&this.opcodes.push(b),d!==c&&this.opcodes.push(d)},type_block:function(a){var b=this.compileProgram(a.program),c=a.name;this.type_name(c),this.pushOpcode("op_applyNoSuchValue",c.path),this.pushOpcode("op_invokeProgram",b.index),this.pushOpcode("op_append")},type_inverse:function(a){var b=this.compileProgram(a.program),c=a.name;this.type_name(c),this.pushOpcode("op_applyNoSuchValue",c.path),this.pushOpcode("op_invokeProgramInverse",b.index),this.pushOpcode("op_append")},type_content:function(a){this.pushOpcode("op_appendContent",a.content)},type_comment:function(){},type_mustache:function(a){var b=a.pipes,c,d=b.length,e=a.name,f=e.path;this.type_name(e),this.pushOpcode("op_evaluateValue",f),this.pushOpcode("op_applyPrePipeProcess",f);for(c=0;c<d;c++)this.pushOpcode("op_applyPipe",b[c],f);this.pushOpcode("op_applyPostPipeProcess",f),a.escape&&this.pushOpcode("op_escape"),this.pushOpcode("op_append")},type_name:function(a){var b=a.segments,c,d=b.length;this.pushOpcode("op_lookupFromContext",b[0]);for(c=1;c<d;c++)this.pushOpcode("op_lookupFromStack",b[c])}},d=function(a){this.environment=a,this.name=a.name,this.source=[""],this.stackSlot=0,this.stackVars=[]},d.ROOT_CONTEXT="$root",d.PARENT_CONTEXT="$parent",d.THIS_CONTEXT="$this",d.INDEX="$index",d.HAS_NEXT="$hasNext",d.prototype={nameLookup:function(a,b){return a+'["'+b+'"]'},appendToBuffer:function(a){this.source.push("buffer += "+a+";")},quoteString:function(a){return a=a.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r"),'"'+a+'"'},compileDescendants:function(){var a=[],b=this.environment.context.allEnvironments,c,e=b.length,f,g,h;for(c=1;c<e;c++)f=b[c],g=new d(f),h=g.compileSubProgram(),a.push(h);return a},execOpcodes:function(){var b=this.environment.opcodes,c,d=b.length,e,f,g,h;for(c=0;c<d;){e=b[c],h=[],g=a.OPCODE_PARAMLENGTH_MAP[e];for(c++,f=0;c<d&&f<g;c++,f++)h.push(b[c]);this[e].apply(this,h)}},generate:function(a,b){var c;return this.stackVars.length>0&&(this.source[0]+=", "+this.stackVars.join(", ")),this.source[0]+=', rootContext = context, buffer = "", undef, escape = this.escape, handleBlock = this.handleBlock, handleInverse = this.handleInverse, noSuchValue = this.noSuchValue, noSuchPipe = this.noSuchPipe, prePipeProcess = this.prePipeProcess, postPipeProcess = this.postPipeProcess, pipes = this.pipes, pipe',this.source[0]&&(this.source[0]="var"+this.source[0].slice(1)+";"),this.source[0]+="\n\n"+a.join("\n\n")+"\n",this.source.push("return buffer;"),c="  "+this.source.join("\n  "),b?new Function("context","ancestor",c):"function (context, ancestor) {\n"+c+"\n"+"}"},generateSubProgram:function(){var a="  ",b;return this.stackVars.length>0&&(this.source[0]+=", "+this.stackVars.join(", ")),this.source[0]+=', buffer = ""',this.source[0]&&(this.source[0]="var"+this.source[0].slice(1)+";"),this.source.push("return buffer;"),b="  "+a+this.source.join("\n  "+a),a+"function "+this.name+" (context, ancestor, index, hasNext) {\n"+b+"\n"+a+"}"},compile:function(a){var b=this.compileDescendants();return this.execOpcodes(),this.generate(b,a)},compileSubProgram:function(){return this.execOpcodes(),this.generateSubProgram()},expandStack:function(){var a;return this.stackSlot++,a="stack"+this.stackSlot,this.stackSlot>this.stackVars.length&&this.stackVars.push(a),a},shrinkStack:function(){this.stackSlot--},currentStack:function(){return"stack"+this.stackSlot},op_invokeProgram:function(a){var b=this.currentStack(),c=this.environment.context.allEnvironments[a];this.source.push(b+" = handleBlock(context, ancestor, "+b+", "+c.name+");")},op_invokeProgramInverse:function(a){var b=this.currentStack(),c=this.environment.context.allEnvironments[a];this.source.push(b+" = handleInverse(context, ancestor, "+b+", "+c.name+");")},op_applyPipe:function(a,b){var c=this.currentStack();this.source.push("pipe = "+this.nameLookup("context",a)+";"),this.source.push('if (typeof pipe === "function") { '+c+" = pipe.call(context, "+c+"); }"),this.source.push("else { pipe = "+this.nameLookup("pipes",a)+";"),this.source.push('  if (typeof pipe === "function") { '+c+" = pipe.call(context, "+c+"); }"),this.source.push("  else { "+c+' = noSuchPipe.call(context, "'+a+'", '+c+', "'+b+'"); }}')},op_applyPrePipeProcess:function(a){var b=this.currentStack();this.source.push(b+" = prePipeProcess("+b+', "'+a+'");')},op_applyPostPipeProcess:function(a){var b=this.currentStack();this.source.push(b+" = postPipeProcess("+b+', "'+a+'");')},op_escape:function(){var a=this.currentStack();this.source.push(a+" = escape("+a+");")},op_append:function(){var a=this.currentStack();this.appendToBuffer(a),this.shrinkStack()},op_appendContent:function(a){a=this.quoteString(a),this.appendToBuffer(a)},op_evaluateValue:function(a){var b=this.currentStack();this.source.push("if (typeof "+b+' === "function") { '+b+" = "+b+".call(context); }"),this.source.push("if ("+b+" === undef) { "+b+" = "+'noSuchValue.call(context, "'+a+'"); }')},op_lookupFromContext:function(a){var b=this.expandStack(),c;a===d.ROOT_CONTEXT?(c="rootContext",this.source.push("ancestor = [];")):a===d.PARENT_CONTEXT?c="ancestor.pop()":a===d.THIS_CONTEXT?c="context":a===d.INDEX?c="index":a===d.HAS_NEXT?c="hasNext":(c=this.nameLookup("context",a),this.source.push("ancestor.push(context);")),this.source.push(b+" = "+c+";")},op_lookupFromStack:function(a){var b=this.currentStack(),c;a===d.ROOT_CONTEXT?(c="rootContext",this.source.push("ancestor = [];")):a===d.PARENT_CONTEXT?c="ancestor.pop()":a===d.THIS_CONTEXT?c=b:a===d.INDEX?c="index":a===d.HAS_NEXT?c="hasNext":(c="("+b+" === null || "+b+" === undef) ? "+b+" : "+this.nameLookup(b,a)+"",this.source.push("ancestor.push(context);")),this.source.push(b+" = "+c+";")}};var e=function(a){try{return b.parse(a)}catch(c){throw c.name=="SyntaxError"?new Error(c.message+" line="+c.line+". column="+c.column+".\n"+a):c}},f=function(b){var c=e(b),f=new a(c),g=f.compile(),h=new d(g);return h.compile(!0)};return{Compiler:a,JsCompiler:d,parse:e,compile:f}}(),f={handleBlock:function(a,b,c,e){var f="",g,h,i=[];if(d.isArray(c)){b.push(c),h=c.length;for(g=0;g<h;g++)i[g]=e(c[g],b,g,g+1<h);f=i.join(""),b.pop()}else d.isFunction(c)?c.call(a)&&(f=e(a,b)):d.isObject(c)?(b.push(c),f=e(c,b),b.pop()):c&&(f=e(a,b));return f},handleInverse:function(a,b,c,e){var f="";return c?d.isFunction(c)?c.call(a)||(f=e(a,b)):d.isArray(c)&&c.length===0&&(f=e(a,b)):f=e(a,b),f},prepare:function(a,b){var c={escape:d.escape,handleBlock:f.handleBlock,handleInverse:f.handleInverse,noSuchValue:b.noSuchValue,noSuchPipe:b.noSuchPipe,prePipeProcess:b.prePipeProcess,postPipeProcess:b.postPipeProcess,pipes:b.pipes},g=e.compile(a);return{render:function(a){return g.call(c,a,[])}}}},g=function(){var a;return{name:"tempura",version:"0.0.3",settings:{pipes:{},prePipeProcess:function(a,b){return a},postPipeProcess:function(b,c){return b===a?"":b},noSuchValue:function(b){return a},noSuchPipe:function(a,b,c){return b}},prepare:function(a,b){var c={};b=b||{},c.noSuchValue=b.noSuchValue||this.settings.noSuchValue,c.noSuchPipe=b.noSuchPipe||this.settings.noSuchPipe,c.prePipeProcess=b.prePipeProcess||this.settings.prePipeProcess,c.postPipeProcess=b.postPipeProcess||this.settings.postPipeProcess,c.pipes=d.extend({},b.pipes,this.settings.pipes);if(!d.isFunction(c.noSuchValue))throw new Error('the "noSuchValue" option or setting must be function.');if(!d.isFunction(c.noSuchPipe))throw new Error('the "noSuchPipe" option or setting must be function.');if(!d.isFunction(c.prePipeProcess))throw new Error('the "prePipeProcess" option or setting must be function.');if(!d.isFunction(c.postPipeProcess))throw new Error('the "postPipeProcess" option or setting must be function.');return f.prepare(a,c)},internal:{parser:b,util:d,compiler:e,core:f}}}();typeof module!="undefined"?module.exports=g:typeof define=="function"&&define.amd?define("tempura",function(){return g}):a.tempura=g})(this);