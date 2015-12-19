/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["gYearMonth"] = function(ctx, children) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_gYearMonth, /^([12][0-9]{3})-(0[1-9]|1[012])$/, function() {}, function() {
		return false;
	});
};