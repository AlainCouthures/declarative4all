"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_unparsed$_text_1 = function() {
  this.notyet();
};
Fleur.Context.prototype.fn_unparsed$_text_2 = function() {
  this.notyet();
};

Fleur.XPathFunctions_fn["unparsed-text#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:unparsed-text", Fleur.Context.prototype.fn_unparsed$_text_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_string_01);

Fleur.XPathFunctions_fn["unparsed-text#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:unparsed-text", Fleur.Context.prototype.fn_unparsed$_text_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_1], Fleur.SequenceType_string_01);
/*
Fleur.XPathFunctions_fn["unparsed-text"] = function(ctx, children, callback) {
  var mediatype = "text/plain";
  if (children.length !== 1) {
    Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
    return;
  }
  var cb = function(n) {
    var op1;
    var a1 = Fleur.Atomize(n);
    op1 = Fleur.toJSString(a1);
    if (op1[0] < 0) {
      Fleur.callback(function() {callback(a1);});
      return;
    }
    var docname = op1[1];
    var httpget = docname.startsWith("http://") || Fleur.inBrowser;
    var fileread = docname.startsWith("file://") || !httpget;
    if (httpget) {
      if (docname.startsWith("http://")) {
        docname = docname.substr(7);
      }
      var getp = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', docname, true);
        req.onload = function() {
          if (req.status === 200) {
            resolve(req.responseText);
          } else {
            reject(Fleur.error(ctx, "FODC0002"));
              }
        };
        req.send(null);
      });
      getp.then(
        function(s) {
          var parser = new Fleur.DOMParser();
          callback(parser.parseFromString(s, mediatype));
        },
        function(a) {
          callback(a);
        }
      );
    } else if (fileread) {
      if (docname.startsWith("file://")) {
        docname = docname.substr(7);
      }
      if (!docname.startsWith(global.path.sep)) {
        docname = global.path.join(Fleur.baseDir, docname);
      }
      global.fs.readFile(docname, 'binary', function(err, file){
        if (err) {
          process.stdout.write(err);
          Fleur.callback(function() {callback();});
        } else {
          var a = new Fleur.Text();
          a.schemaTypeInfo = Fleur.Type_string;
          a.data = file;
          Fleur.callback(function() {callback(a);});
        }
      });
    }
  };
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
*/