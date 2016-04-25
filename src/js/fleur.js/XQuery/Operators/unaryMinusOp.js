/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.unaryMinusOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op;
		var a = Fleur.Atomize(n);
		op = Fleur.toJSNumber(a);
		if (op[0] < 0) {
			callback(a);
			return;
		}
		a.data = "" + (- op[1]);
		callback(a);
	});
};