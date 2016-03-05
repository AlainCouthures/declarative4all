/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["substring-before"] = function(ctx, children) {
	Fleur.XPathStringContentFunction(ctx, children, function(a, b) {
		return a.substring(0, a.indexOf(b));
	}, Fleur.Type_string);
};