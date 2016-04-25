/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["duration"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["duration"], /^-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?$/, function() {}, function() {
		return false;
	}, callback);
};