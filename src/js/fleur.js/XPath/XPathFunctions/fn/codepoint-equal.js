/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["codepoint-equal"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, true, function(a, b) {
		return a === b;
	}, Fleur.Type_boolean, callback);
};