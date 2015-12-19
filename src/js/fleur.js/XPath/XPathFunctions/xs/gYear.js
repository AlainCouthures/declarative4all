/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["gYear"] = function(ctx, children) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_gYear, /^([\-+]?([0-9]{4}|[1-9][0-9]{4,}))?$/, function() {}, function() {
		return false;
	});
};