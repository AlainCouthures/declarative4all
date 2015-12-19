/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_math["exp10"] = function(ctx, children) {
	Fleur.XPathNumberFunction(ctx, children, function(x) {return Math.pow(10, x);}, Fleur.Type_double);
};