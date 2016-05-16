/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["floor"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.floor, function(a) {
		return a.schemaTypeInfo;
	}, callback);
};