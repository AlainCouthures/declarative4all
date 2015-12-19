/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["unsignedLong"] = function(ctx, children) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_unsignedLong, /^\+?[0-9]+$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return value > 18446744073709551615;
	});
};