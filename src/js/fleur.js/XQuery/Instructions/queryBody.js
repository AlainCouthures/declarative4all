"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_queryBody = function(children) {
  return this.gen(children[0]);
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.queryBody] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    if (children.length > 1) {
      Fleur.XQueryEngine[Fleur.XQueryX.queryBody](ctx, children.slice(1), callback);
    } else {
      Fleur.callback(function() {callback(n);});
    }
  });
};
*/