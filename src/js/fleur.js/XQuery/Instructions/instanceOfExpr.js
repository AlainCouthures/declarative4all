/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.instanceOfExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var seqtype = children[1][1];
		var occurrence = "1";
		var res = true;
		if (seqtype.length === 2) {
			occurrence = seqtype[1][0];
		}
		if (n !== Fleur.EmptySequence) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (occurrence === "1" || occurrence === "?") {
					res = false;
				} else {
				}
			} else {
				var prevstep = ctx._stepctx;
				if (!prevstep) {
					ctx._stepctx = {};
				}
				ctx._stepctx.curr = ctx._result;
				Fleur.XQueryEngine[seqtype[0][0]](ctx, seqtype[0][1]);
				if (ctx._stepctx.ignore) {
					res = false;
				}
				ctx._stepctx = prevstep;
			}
		} else if (occurrence === "1" || occurrence === "+") {
				res = false;
		}
		var a = new Fleur.Text();
		a.data = "" + res;
		a.schemaTypeInfo = Fleur.Type_boolean;
		callback(a);
	});
};