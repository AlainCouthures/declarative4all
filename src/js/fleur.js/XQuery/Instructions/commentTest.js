/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_commentTest = function() {
	return this.inst("xqx_commentTest()");
};

Fleur.XQueryEngine[Fleur.XQueryX.commentTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.COMMENT_NODE ? Fleur.EmptySequence : ctx._curr);});
};