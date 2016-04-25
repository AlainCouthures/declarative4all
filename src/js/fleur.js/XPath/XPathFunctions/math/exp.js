/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_math["exp"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.exp, Fleur.Type_double, callback);
};