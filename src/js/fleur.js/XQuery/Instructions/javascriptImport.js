/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.javascriptImport] = function(ctx, children, callback) {
  var at = children[0][1][0];
  var httpget = at.startsWith("http://") || Fleur.inBrowser;
  var fileread = at.startsWith("file://") || !httpget;
  if (httpget) {
    if (at.startsWith("http://")) {
      at = at.substr(7);
    }
    var getp = new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', at, true);
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
        Fleur.callback(function() {callback();});
      },
      function(a) {
        Fleur.callback(function() {callback();});
      }
    );
  } else if (fileread) {
    if (at.startsWith("file://")) {
      at = at.substr(7);
    }
    if (!at.startsWith(global.path.sep)) {
      at = global.path.join(Fleur.baseDir, at);
    }
    global.fs.readFile(at, 'binary', function(err, file){
      if (err) {
        process.stdout.write(err);
        Fleur.callback(function() {callback();});
      } else {
        (0, eval)(file);
        Fleur.callback(function() {callback();});
      }
    });
  }
  
};