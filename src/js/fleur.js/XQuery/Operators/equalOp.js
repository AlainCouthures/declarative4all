/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_equalOp = function(children) {
  return this.gen(children[0][1][0], Fleur.atomicTypes) + this.gen(children[1][1][0], Fleur.atomicTypes) + this.inst("xqx_generalComp(Fleur.eqOp)");
};

Fleur.XQueryEngine[Fleur.XQueryX.equalOp] = function(ctx, children, callback) {
  Fleur.XPathGenTestOpFunction(ctx, children, Fleur.eqOp, callback);
};