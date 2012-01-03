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
  = '{{' _ name:Path processors:Pipeline _ '}}' {
      return {
        type: 'type_mustache',
        name: name,
        processors: processors,
        escape: true
      };
    }
  / '{{{' _ name:Path processors:Pipeline _ '}}}' {
      return {
        type: 'type_mustache',
        name: name,
        processors: processors,
        escape: false
      };
    }

Pipeline
  = pipes:(_ '|' _ Id)* {
      var processors = [];
      var i;
      var len = pipes.length;
      for (i = 0; i < len; i++) {
        processors.push(pipes[i][3]);
      }
      return processors;
    }
  / {
      return [];
    }

Comment
  = '{{!' chars:(!'}}' .)* '}}' {
      var comment = '';
      var i;
      var len = chars.length;
      for (i = 0; i < len; i++) {
        comment += chars[i][1];
      }
      return {
        type: 'type_comment',
        comment: comment
      };
    }

Content
  = chars:(!'{{' .)+  {
      var content = '';
      var i;
      var len = chars.length;
      for (i = 0; i < len; i++) {
        content += chars[i][1];
      }
      return {
        type: 'type_content',
        content: content
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
        segments: segments
      };
    }

Id
  = chars:[a-zA-Z0-9_$-%@!]+ {
      return chars.join('');
    }
_
  = Whitespace*

Whitespace
  = [ \t\n\r]