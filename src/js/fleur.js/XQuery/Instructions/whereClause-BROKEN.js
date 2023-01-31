/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.whereClause] = function(ctx, children, callback, resarr) {
  //console.log("whereClause ");
  var i = 0;
  ctx.env.varresolver = resarr[0];
  var cb = function(n) {
    if (Fleur.XPathFunctions_fn["boolean#1"].jsfunc(n)) {
      i++;
    } else {
      resarr.splice(i, 1);
    }
    if (i !== resarr.length) {
      ctx.env.varresolver = resarr[i];
      Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
    } else {
      Fleur.callback(function() {callback(Fleur.EmptySequence);});
    }
  };
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};