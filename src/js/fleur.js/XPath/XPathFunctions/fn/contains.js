/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["contains"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, function(a, b) {
		return a.indexOf(b) !== -1;
	}, Fleur.Type_boolean, callback);
};