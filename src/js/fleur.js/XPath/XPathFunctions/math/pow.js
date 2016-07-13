/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_math["pow"] = function(ctx, children, callback) {
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
		var a2 = Fleur.Atomize(n);
		var op2 = Fleur.toJSNumber(a2);
		if (op2[0] < 0) {
			Fleur.callback(function() {callback(a2);});
			return;
		}
		var power = op2[1];
		Fleur.XPathNumberFunction(ctx, children.slice(0, 1), function(v) {
			return Math.pow(v, power);
		}, Fleur.Type_double, callback);
	});
};