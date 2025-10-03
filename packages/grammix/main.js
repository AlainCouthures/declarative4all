function main() {
  global.fs = require('fs');
  const startparams = 2;
  const params = {};
  for (let i = startparams, l = process.argv.length; i < l; i++) {
    const val = process.argv[i];
    if (val === "-h" || val === "--help") {
      params.usage = true;
    } else if (val === "-V" || val === "--version") {
      params.version = true;
    } else if (val === "-g" && !params.g) {
      params.g = process.argv[++i];
    } else if (val === "-i" && !params.i) {
      params.i = process.argv[++i];
    } else if (val === "-o" && !params.o) {
      params.o = process.argv[++i];
    } else if (val === "--indent") {
      params.indent = true;
    } else {
      params.usage = true;
    }
  }
  if (params.usage || (!params.g && !params.version)) {
    process.stdout.write("Usage: node grammix (-h | -V | -g grammar (-i <FILE>) (-o <FILE>) (--indent))\n");
    process.stdout.write(" -h, --help       Show this help message and exit\n");
    process.stdout.write(" -V, --version    Show the application version and exit\n");
    process.stdout.write(" -g               Invisible XML grammar file\n");
    process.stdout.write(" -i               Text input file (optional)\n");
    process.stdout.write(" -o               XML output file (optional)\n");
    process.stdout.write("     --indent     Indent the XML output\n");
  } else if (params.version) {
    process.stdout.write("Grammix 1.0\n");
    process.stdout.write("Built on 2024-12-03\n");
    process.stdout.write("Copyright (c) 2024 agenceXML\n");
  } else {
    global.fs.readFile(params.g, 'binary', function(err, grammar) {
      if (err) {
        process.stdout.write(err);
      } else {
        if (params.i) {
          global.fs.readFile(params.i, 'utf8', function(err, input) {
            if (err) {
              process.stdout.write(err);
            } else {
              const result = Grammix.fromIXml(grammar).parse(input, new Grammix.XmlDocument());
              const output = params.indent ? result.toIndentedString() : result.toString();
              if (params.o) {
                global.fs.writeFile(params.o, output, function(err) {
                  if (err) {
                    process.stdout.write(err);
                  }
                });
              } else {
                process.stdout.write(output);
              }
            }
          });
        } else {
          const output = params.indent ? Grammix.fromIXml(grammar).toIndentedString() : Grammix.fromIXml(grammar).toString();
          if (params.o) {
            global.fs.writeFile(params.o, output, function(err) {
              if (err) {
                process.stdout.write(err);
              }
            });
          } else {
            process.stdout.write(output);
          }
        }
      }
    });
  }
}
if (typeof exports !== 'undefined') {
  main();
}