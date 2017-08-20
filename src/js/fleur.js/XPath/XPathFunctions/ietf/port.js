/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_ietf["port"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_port, /^[0-9]+$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = String(value);
		return value > 65535;
	}, callback);
};