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
  = Open '#' _ open:Path _ Close program:Program Open '/' _ close:Path _ Close {
      return {
        type: 'type_block',
        name: open,
        program: program
      };
    }

Inverse
  = Open '^' _ open:Path _ Close program:Program Open '/' _ close:Path _ Close {
      return {
        type: 'type_inverse',
        name: open,
        program: program
      };
    }

Mustache
  = Open _ name:Path pipes:Pipes _ Close {
      return {
        type: 'type_mustache',
        name: name,
        pipes: pipes,
        escape: true
      };
    }
  / OpenUnescape _ name:Path pipes:Pipes _ CloseUnescape {
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
  = Open '!' comment:(!Close .)* Close {
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
  = content:(!Open .)+  {
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
  = id:[a-zA-Z0-9_$-]+ {
      return id.join('');
    }

Open
  = '{{'

Close
  = '}}'

OpenUnescape
  = '{{{'

CloseUnescape
  = '}}}'

_
  = Whitespace*

Whitespace
  = [ \t\n\r]