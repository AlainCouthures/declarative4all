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
Fleur.XQueryEngine[Fleur.XQueryX.sequenceExpr] = function(ctx, children) {
	ctx._result = new Fleur.Sequence();
	ctx._result.data = "";
	ctx._result.nodeType = Fleur.Node.SEQUENCE_NODE;
};