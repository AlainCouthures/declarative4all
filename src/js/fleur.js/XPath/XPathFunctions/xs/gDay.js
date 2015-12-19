/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["gDay"] = function(ctx, children) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_gDay, /^---(0[1-9]|[12][0-9]|3[01])$/, function() {}, function() {
		return false;
	});
};