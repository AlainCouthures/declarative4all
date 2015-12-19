/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
/**
 * @callback
 */
Fleur.XQueryEngine[Fleur.XQueryX.textTest] = function(ctx, children) {
	if (ctx._stepctx.curr.nodeType !== Fleur.Node.TEXT_NODE) {
		ctx._stepctx.curr = null;
	}
};