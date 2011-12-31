{
  function verifyMatch(open, close)  {
    if (open.path !== close.path) {
      var errorPosition = computeErrorPosition();
      throw new parser.SyntaxError(
        open.path + " doesn't match " + close.path,
        errorPosition.line,
        errorPosition.column
      );
    }
  }
}

start
  = Program

Program
  = head:Statement tail:(Statement)* {
      var statements = [head];
      var i;
      var len = tail.length;
      for (i = 0; i < len; i++) {
        statements.push(tail[i]);
      }
      return {
        type: 'type_program',
        statements: statements
      };
    }
  / '' {
      return {
        type: 'type_program',
        statements: []
      }
    }

Statement
  = Block
  / Inverse
  / Mustache
  / Comment
  / Content

Block
  = '{{#' _ open:Path _ '}}' program:Program '{{/' _ close:Path _ '}}' {
      verifyMatch(open, close);
      return {
        type: 'type_block',
        name: open,
        program: program
      };
    }

Inverse
  = '{{^' _ open:Path _ '}}' program:Program '{{/' _ close:Path _ '}}' {
      verifyMatch(open, close);
      return {
        type: 'type_inverse',
        name: open,
        program: program
      };
    }

Mustache
  = '{{' _ name:Path pipes:Pipes _ '}}' {
      return {
        type: 'type_mustache',
        name: name,
        pipes: pipes,
        escape: true
      };
    }
  / '{{{' _ name:Path pipes:Pipes _ '}}}' {
      return {
        type: 'type_mustache',
        name: name,
        pipes: pipes,
        escape: false
      };
    }

Pipes
  = pipes:(_ '|' _ Id)* {
      var result = [];
      var i;
      var len = pipes.length;
      for (i = 0; i < len; i++) {
        result.push(pipes[i][3]);
      }
      return result;
    }
  / {
      return [];
    }

Comment
  = '{{!' comment:(!'}}' .)* '}}' {
      var chars = [];
      var i;
      var len = comment.length;
      for (i = 0; i < len; i++) {
        chars.push(comment[i][1]);
      }
      return {
        type: 'type_comment',
        comment: chars.join('')
      };
    }

Content
  = content:(!'{{' .)+  {
      var chars = [];
      var i;
      var len = content.length;
      for (i = 0; i < len; i++) {
        chars.push(content[i][1]);
      }
      return {
        type: 'type_content',
        content: chars.join('')
      };
    }

Path
  = head:Id tail:('.' Id)* {
      var segments = [head];
      var i;
      var len = tail.length;
      for (i = 0; i < len; i++) {
        segments.push(tail[i][1]);
      }
      return {
        type: 'type_name',
        path: segments.join('.'),
        segments: segments,
        isSimple: segments.length === 1
      };
    }

Id
  = id:[a-zA-Z0-9_$-%@!]+ {
      return id.join('');
    }
_
  = Whitespace*

Whitespace
  = [ \t\n\r]