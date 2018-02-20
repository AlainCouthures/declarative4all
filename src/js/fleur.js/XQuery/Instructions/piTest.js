/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.piTest] = function(ctx, children, callback) {
	if (ctx._curr.nodeType !== Fleur.Node.PROCESSING_INSTRUCTION_NODE || (children.length === 1 && ctx._curr.target !== children[0][1][0])) {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	Fleur.callback(function() {callback(ctx._curr);});
};