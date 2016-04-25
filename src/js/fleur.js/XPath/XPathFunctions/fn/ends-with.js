/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["ends-with"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, function(a, b) {
		return a.endsWith(b);
	}, Fleur.Type_boolean, callback);
};