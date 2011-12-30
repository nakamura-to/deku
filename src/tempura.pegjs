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
      return ast.newProgram(statements);
    }
  / '' {
      return ast.newProgram([]);
    }

Statement
  = Block
  / Inverse
  / Mustache
  / Comment
  / Content

Block
  = Open '#' _ open:Path _ Close program:Program Open '/' _ close:Path _ Close {
      return ast.newBlock(open, program, close);
    }

Inverse
  = Open '^' _ open:Path _ Close program:Program Open '/' _ close:Path _ Close {
      return ast.newInverse(open, program, close);
    }

Mustache
  = Open _ path:Path pipes:Pipes _ Close {
      return ast.newMustache(path, pipes, true);
    }
  / OpenUnescape _ path:Path pipes:Pipes _ CloseUnescape {
      return ast.newMustache(path, pipes, false);
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
      return ast.newComment(chars.join(''));
    }

Content
  = content:(!Open .)+  {
      var chars = [];
      var i;
      var len = content.length;
      for (i = 0; i < len; i++) {
        chars.push(content[i][1]);
      }
      return ast.newContent(chars.join(''));
    }

Path
  = head:Id tail:('.' Id)* {
      var segments = [head];
      var i;
      var len = tail.length;
      for (i = 0; i < len; i++) {
        segments.push(tail[i][1]);
      }
      return ast.newName(segments);
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