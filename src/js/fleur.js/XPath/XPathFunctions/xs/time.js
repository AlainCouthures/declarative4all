/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["time"] = function(ctx, children) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_time, /^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](\.[0-9]+)?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$/, function() {}, function() {
		return false;
	});
};