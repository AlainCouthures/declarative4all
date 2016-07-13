/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["round-half-to-even"] = function(ctx, children, callback) {
	if (children.length === 2) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var a2 = Fleur.Atomize(n);
			var op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			var precision = op2[1];
			Fleur.XPathNumberFunction(ctx, children.slice(0, 1), function(v) {
				var v2 = v * Math.pow(10, precision);
				if (v2 === Number.POSITIVE_INFINITY) {
					return v;
				}
				if (v2 === 0) {
					return 0;
				}
				if (v2 - Math.floor(v2) === 0.5 && Math.floor(v2) % 2 === 0) {
					v2 -= 1;
				}
				return Math.round(v2) / Math.pow(10, precision);
			}, function(a) {
				return a.schemaTypeInfo;
			}, callback);
		});
		return;
	}
	Fleur.XPathNumberFunction(ctx, children, function(v) {
		if (v - Math.floor(v) === 0.5 && Math.floor(v) % 2 === 0) {
			v -= 1;
		}
		return Math.round(v);
	}, function(a) {
		return a.schemaTypeInfo;
	}, callback);
};