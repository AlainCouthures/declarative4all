/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.elementTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ELEMENT_NODE ? Fleur.EmptySequence : ctx._curr);});
};