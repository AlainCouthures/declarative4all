/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_lessThanOrEqualOp = function(children) {
	return this.gen(children[0][1][0], Fleur.atomicTypes) + this.gen(children[1][1][0], Fleur.atomicTypes) + this.inst("xqx_generalComp(Fleur.leOp)");
};

Fleur.XQueryEngine[Fleur.XQueryX.lessThanOrEqualOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, Fleur.leOp, callback);
};