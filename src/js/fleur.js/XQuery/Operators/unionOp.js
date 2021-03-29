/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_unionOp = function(children) {
	return this.gen(children[0][1][0]) + this.gen(children[1][1][0]) + this.inst("xqx_unionOp()");
};