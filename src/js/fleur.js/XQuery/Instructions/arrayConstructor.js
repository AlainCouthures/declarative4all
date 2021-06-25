/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.arrayConstructor] = function(ctx, children, callback) {
  var arr = new Fleur.Array();
  var i = 0;
  var cb = function(n) {
    if (n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    }
    if (n !== Fleur.EmptySequence) {
      arr.appendChild(n);
    }
    i++;
    if (i === children.length) {
      Fleur.callback(function() {callback(arr);});
      return;
    }
    Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb);
  };
  if (children.length !== 0) {
    Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
  } else {
    Fleur.callback(function() {callback(arr);});
  }
};