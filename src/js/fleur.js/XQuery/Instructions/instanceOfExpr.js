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
		var a;
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
				Fleur.XQueryEngine[seqtype[0][0]]({
					_curr: n,
					env: ctx.env
				}, seqtype[0][1], function(n) {
					a = new Fleur.Text();
					a.data = "" + (n !== Fleur.EmptySequence);
					a.schemaTypeInfo = Fleur.Type_boolean;
					Fleur.callback(function() {callback(a);});
				});
				return;
			}
		} else if (occurrence === "1" || occurrence === "+") {
				res = false;
		}
		a = new Fleur.Text();
		a.data = "" + res;
		a.schemaTypeInfo = Fleur.Type_boolean;
		Fleur.callback(function() {callback(a);});
	});
};