/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["nonPositiveInteger"] = function(ctx, children) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonPositiveInteger"], /^(-[0-9]+|0)$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return false;
	});
};