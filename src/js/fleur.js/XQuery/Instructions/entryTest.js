"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_entryTest = function() {
  return this.inst("xqx_entryTest()");
};

Fleur.XQueryEngine[Fleur.XQueryX.entryTest] = function(ctx, children, callback) {
  Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ENTRY_NODE ? Fleur.EmptySequence : ctx._curr);});
};