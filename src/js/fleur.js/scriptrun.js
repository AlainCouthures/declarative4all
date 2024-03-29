"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
if ((new Function("try {return this === window;} catch(e) {return false;}"))()) {
  document.addEventListener('DOMContentLoaded', function() {
    var scripts = Array.prototype.slice.call(document.getElementsByTagName("script"), 0).filter(function(sc) {
      return sc.getAttribute("type") === "application/xquery";
    });
    var parser = new Fleur.DOMParser();
    var xmldoc;
    var xqeval = function(xexpr) {
      try {
        xmldoc.evaluate(xexpr).then(
          function(res) {},
          function(err) {
            alert(err.toXQuery());
          }
        );
      } catch(e) {
        alert("Exception!\n" + e.stack);
      }
    };
    xmldoc = parser.parseFromString("<dummy/>", "application/xml");
    scripts.forEach(function(sc) {
      xqeval(sc.textContent);
    });
  }, false);
} else if (global) {
  global.fs = require('fs');
  global.fsPromises = require("fs/promises");
  global.http = require('http');
  global.path = require('path');
  global.url = require('url');
  global.os = require('os');
  global.dgram = require('dgram');
  global.child_process = require('child_process');
  var startparams = process.argv[1].endsWith('fleur.js') || process.argv[1].endsWith('fleur') ? 2 : 3;
  var params = {argv: []};
  process.argv.forEach(function(val, i) {
    if (i >= startparams) {
      if (!params.q && !params.qs) {
        if (val.startsWith("-q:") && val.length > 3) {
          params.q = val.substring(3);
        } else if (val.startsWith("-qs:") && val.length > 4) {
          params.qs = val.substring(4);
        } else if (val.startsWith("-js:") && val.length > 4) {
          params.js = val.substring(4);
        } else if (val.startsWith("-s:") && !params.s && val.length > 3) {
          params.s = val.substring(3);
        } else if (val.startsWith("-o:") && !params.o && val.length > 3) {
          params.o = val.substring(3);
        } else if (val.startsWith("-p:") && !params.p && val.length > 3) {
          params.p = parseInt(val.substring(3), 10);
        } else if (val.startsWith("-f:") && !params.f && val.length > 3) {
          params.f = val.substring(3);
        } else {
          params.usage = true;
        }
      } else if (params.q || params.qs) {
        params.argv.push(val);
      } else {
        params.usage = true;
      }
    }
  });
  if (params.usage || (!params.qs && !params.q && (params.s || params.o))) {
    process.stdout.write("Usage: node fleur ([-s:xmlfile] [-js:jsfile|-o:outfile] (-q:queryfile|-qs:querystring) [params]|[-p:port] [-f:folder])\n");
    process.stdout.write(" -s:     XML input file (optional)\n");
    process.stdout.write(" -js:    Javascript output file (optional)\n");
    process.stdout.write(" -o:     output file (optional)\n");
    process.stdout.write(" -q:     query file\n");
    process.stdout.write(" -qs:    query string\n");
    process.stdout.write(" -p:     http server port\n");
    process.stdout.write(" -f:     http server folder\n");
    process.stdout.write(" params  name=value as externals");
  } else if (params.qs || params.q) {
    var parseval = function(xml, xexpr, out) {
      var parser = new global.Fleur.DOMParser();
      var xmldoc = parser.parseFromString(xml, "application/xml");
      var env;
      if (params.argv.length > 0) {
        var args = {};
        params.argv.forEach(function(p) {
          var pp = p.split("=");
          args[pp[0]] = pp[1];
        });
        env = {
          args: args
        };
      }
      try {
        var d1 = new Date();
        xmldoc.evaluate(xexpr, null, env).then(
          function(res) {
            if (out) {
                  global.fs.writeFile(out, res.toXQuery(), function(err) {if (err) process.stdout.write(err);});
            } else {
              process.stdout.write(res.toXQuery());
              var d2 = new Date();
              console.log("\nExecution Time: " + ((d2 - d1) / 1000) + "s");
            }
          },
          function(err) {
            if (out) {
                  global.fs.writeFile(out, err.toXQuery(), function(err) {if (err) process.stdout.write(err);});
            } else {
              process.stdout.write(err.toXQuery());
            }
          }
        );
      } catch(e) {
        process.stdout.write("Exception!\n" + e.stack);
      }
    };
    Fleur.baseDir = params.q ? global.path.dirname(params.q) : process.cwd();
    var sourcejs = function(xexpr, out) {
      const arr = Fleur.XQueryParser._xq2js(xexpr, [], [], 0);
      const jscript = (new Fleur.Transpiler()).source(arr);
      global.fs.writeFile(out, jscript, function(err) {if (err) process.stdout.write(err);});
    };
    var sourceval = function(xml) {
      if (params.qs) {
        parseval(xml, params.qs, params.o);
      } else {
        global.fs.readFile(params.q, 'binary', function(err, file){
          if (err) {
            process.stdout.write(err);
          } else {
            parseval(xml, file, params.o);
          }
        });
      }
    };
    if (params.js) {
      if (params.qs) {
        sourcejs(params.qs, params.js);
      } else {
        global.fs.readFile(params.q, 'binary', function(err, file){
          if (err) {
            process.stdout.write(err);
          } else {
            sourcejs(file, params.js);
          }
        });
      }
    } else if (params.s) {
      global.fs.readFile(params.s, 'binary', function(err, file){
        if (err) {
          process.stdout.write(err);
        } else {
          sourceval(file);
        }
      });
    } else {
      sourceval("<dummy/>");
    }
  } else if (process.argv[1].endsWith('fleur.js') || process.argv[1].endsWith('fleur')) {
    Fleur.baseDir = global.path.resolve(params.f || process.cwd(), "public");
    var port = params.p;
    port = isNaN(port) || port > 65535 || port === 0 ? 80 : port;
    console.log("Fleur Web Server");
    console.log("Listening to port " + port);
    process.chdir(Fleur.baseDir);
    global.http.createServer(function(request, response) {
      var body, uri, method, newuri, headers, filename, filestats, contentType, ifmodifiedsince, lastmodified;
      body = "";
      var sendfile = function(err, file) {
        if (err) {        
          response.writeHead(err.errno === 34 ? 404 : 500, {"Content-Type": "text/plain"});
          response.end(err.errno === 34 ? "404 Not Found" : "500 Internal server error - " + err);
          return;
        }
        headers = {};
        contentType = Fleur.extension2contentType[global.path.extname(filename)];
        if (contentType) {
          headers["Content-Type"] = contentType;
        }
        if (lastmodified) {
          headers['Expires'] = lastmodified;
          headers["Last-Modified"] = lastmodified;
        }
        response.writeHead(200, headers);
        response.end(file, "binary");
      };
      var execfile = function(err, file) {
        if (err) {        
          response.writeHead(err.errno === 34 ? 404 : 500, {"Content-Type": "text/plain"});
          response.end(err.errno === 34 ? "404 Not Found" : "500 Internal server error - " + err);
          return;
        }
        headers = {};
        lastmodified = (new Date()).toUTCString();
        headers["Last-Modified"] = lastmodified;
          var doc = new Fleur.Document();
        var reqeval = {request: {headers: request.headers, query: global.url.parse(request.url).query}};
          if (body !== "") {
            reqeval.request.body = body;
          }
        doc.evaluate(file, null, reqeval).then(
          function(res) {
            headers["Content-Type"] = res.mediatype;
            response.writeHead(200, headers);
            response.end(res.serialize(), 'binary');
          },
          function(err) {
            contentType = Fleur.extension2contentType[".txt"];
            if (contentType) {
              headers["Content-Type"] = contentType;
            }
            response.writeHead(200, headers);
            response.end(err.toXQuery(), "binary");
          }
        );
      };
      request.on("data", function (chunk) {
        body += chunk;
      });
      request.on("end", function () {
        uri = global.url.parse(request.url).pathname;
        method = request.method;
        lastmodified = null;
        while (uri.endsWith("/")) {
          uri = uri.substr(0, uri.length - 1);
        }
        newuri = uri;
        while (newuri.startsWith("/")) {
          newuri = newuri.substr(1);
        }
        filename = global.path.resolve(process.cwd(), newuri);
        if (!filename.startsWith(process.cwd())) {
          response.writeHead(403, {'Content-Type': 'text/plain'});
          response.end('403 Forbidden');
          return;
        }
        if (global.fs.existsSync(filename)) {
          filestats = global.fs.statSync(filename);
          if (filestats.isDirectory()) {
            if (method === 'GET') {
              response.writeHead(301, {'Location': uri + '/index.' + (global.fs.existsSync(filename + global.path.sep + 'index.html') ? 'html' : global.fs.existsSync(filename + global.path.sep + '/index.htm') ? 'htm' : global.fs.existsSync(filename + global.path.sep + '/index.xqy') ? 'xqy' : 'xml')});
              response.end();
            } else {
              response.writeHead(403, {'Content-Type': 'text/plain'});
              response.end('403 Forbidden' + ' method:' + method);
            }
            return;
          }
          switch(method) {
            case 'GET':
              if (filename.endsWith('.xqy')) {
                global.fs.readFile(filename, 'binary', execfile);
              } else {
                ifmodifiedsince = request.headers['if-modified-since'];
                if (ifmodifiedsince && (new Date(ifmodifiedsince)).getTime() >= (new Date(filestats.mtime.toUTCString())).getTime()) {
                  response.writeHead(304, {'Content-Type': 'text/plain'});
                  response.end('304 Not Modified');
                  return;
                }
                lastmodified = filestats.mtime.toUTCString();
                global.fs.readFile(filename, 'binary', sendfile);
              }
              break;
            case 'POST':
              if (filename.endsWith('.xqy')) {
                global.fs.readFile(filename, 'binary', execfile);
              } else {
                response.writeHead(405, {'Content-Type': 'text/plain'});
                response.end('405 Method Not Allowed');
              }
              break;
            default:
              response.writeHead(405, {'Content-Type': 'text/plain'});
              response.end('405 Method Not Allowed');
          }
          return;
        }
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 Not Found');
      });
    }).listen(port);
  }
}