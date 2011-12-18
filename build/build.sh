#!/bin/sh

curl -d output_info=compiled_code -d output_format=text -d compilation_level=SIMPLE_OPTIMIZATIONS --data-urlencode js_code@'../src/tempura.js' 'http://closure-compiler.appspot.com/compile' > 'tempura-min.js'
