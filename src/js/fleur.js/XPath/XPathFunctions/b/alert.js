/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["alert"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a, op;
		a = Fleur.Atomize(n);
		op = Fleur.toJSString(a);
		if (op[0] >= 0) {
			alert(op[1]);
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};