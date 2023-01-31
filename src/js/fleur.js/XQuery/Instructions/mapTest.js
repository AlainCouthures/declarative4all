"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_mapTest = function() {
  return this.inst("xqx_mapTest()");
};

Fleur.XQueryEngine[Fleur.XQueryX.mapTest] = function(ctx, children, callback) {
  Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.MAP_NODE ? Fleur.EmptySequence : ctx._curr);});
};