/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["normalize-space"] = function(ctx, children, callback) {
	Fleur.XPathStringFunction(ctx, children, function(s) {return s.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");}, null, callback);
};