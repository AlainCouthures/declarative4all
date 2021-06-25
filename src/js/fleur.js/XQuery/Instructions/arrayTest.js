/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_arrayTest = function() {
  return this.inst("xqx_arrayTest()");
};

Fleur.XQueryEngine[Fleur.XQueryX.arrayTest] = function(ctx, children, callback) {
  Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ARRAY_NODE ? Fleur.EmptySequence : ctx._curr);});
};