/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["substring-after"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, function(a, b) {
		var index = a.indexOf(b);
		return index === -1 ? "" : a.substring(index + b.length);
	}, Fleur.Type_string, callback);
};