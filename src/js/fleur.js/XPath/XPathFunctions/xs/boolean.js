/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["boolean"] = function(ctx, children) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_boolean, /^(true|false|0|1)$/, function(ctx) {
		var node = ctx._result;
		if (node.schemaTypeInfo === Fleur.Type_integer || node.schemaTypeInfo === Fleur.Type_decimal || node.schemaTypeInfo === Fleur.Type_float || node.schemaTypeInfo === Fleur.Type_double) {
			node.data = (node.data === "0" || node.data === "NaN") ? "false" : "true";
		} else {
			Fleur.error(ctx, "FORG0001");
		}
	}, function(node) {
		if (node.data === "0") {
			node.data = "false";
		} else if (node.data === "1") {
			node.data = "true";
		}
		return false;
	});
};
