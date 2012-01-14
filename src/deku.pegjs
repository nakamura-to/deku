{
  var defaultPartialContext = {
    type: 'type_name',
    path: '@0',
    segments: ['@0'],
    contextType: 'ref',
    contextIndex: '0'
  };

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
  / Partial
  / Mustache
  / Comment
  / Content

Block
  = '{{#' _ open:Path processors:Pipeline _ '}}' program:Program '{{/' _ close:Path _ '}}' {
      verifyMatch(open, close);
      return {
        type: 'type_block',
        name: open,
        processors: processors,
        program: program
      };
    }

Inverse
  = '{{^' _ open:Path processors:Pipeline _ '}}' program:Program '{{/' _ close:Path _ '}}' {
      verifyMatch(open, close);
      return {
        type: 'type_inverse',
        name: open,
        processors: processors,
        program: program
      };
    }

Partial
  = '{{:' _ name:Path contextDef:(Whitespace+ Path)? _ '}}' {
      return {
        type: 'type_partial',
        name: name,
        context: contextDef[1] || defaultPartialContext
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
  = pipes:(_ '|' _ Path)* {
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
  = chars:(ContentChars)+  {
      var content = '';
      var i;
      var len = chars.length;
      for (i = 0; i < len; i++) {
        content += chars[i];
      }
      return {
        type: 'type_content',
        content: content
      };
    }

ContentChars
  = '\\' backslash:'\\' &'{{' {
      return backslash;
    }
  / '\\' open:'{{' {
      return open;
    }
  / !'{{' char:. {
      return char;
    }

Path
  = head:(ReservedId / Id) tail:('.' Id)* {
      var segments = [head.id || head];
      var i;
      var len = tail.length;
      for (i = 0; i < len; i++) {
        segments.push(tail[i][1]);
      }
      return {
        type: 'type_name',
        path: segments.join('.'),
        segments: segments,
        contextType: head.type || 'default',
        contextIndex: head.index || '0'
      };
    }

ReservedId
  = '@root' {
      return {
        type: 'root',
        id: '@root'
      };
    }
  / '@index' {
      return {
        type: 'index',
        id: '@index'
      };  
    }
  / '@hasNext' {
      return {
        type: 'hasNext',
        id: '@hasNext'
      };
    }
  / '@length' {
      return {
        type: 'length',
        id: '@length'
      };
    }
  / '@' index:[0-9]+ {
      return {
        type: 'ref',
        index: index,
        id: '@' + index
      };
    }
  / '@this' {
      return {
        type: 'ref',
        index: 0,
        id: '@this'
      };
    }
  / '@parent' {
      return {
        type: 'ref',
        index: 1,
        id: '@parent'
      };
    }

Id
  = chars:[a-zA-Z0-9_$%@?]+ {
      var buf = '';
      var i;
      var len = chars.length;
      for (i = 0; i < len; i++) {
        buf += chars[i];
      }
      return buf;
    }
_
  = Whitespace*

Whitespace
  = [ \t\n\r]