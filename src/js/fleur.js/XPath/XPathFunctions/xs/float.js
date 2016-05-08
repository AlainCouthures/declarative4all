/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["float"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_float, /^(([\-+]?([0-9]+(\.[0-9]*)?)|(\.[0-9]+))([eE][\-+]?[0-9]+)?|-?INF|NaN)$/, function() {}, function(node) {
		if (node.data !== "INF" && node.data !== "-INF" && node.data !== "NaN") {
			var value = parseFloat(node.data);
			node.data = ("" + value).replace("e+", "e");
		}
		return false;
	}, callback);
};