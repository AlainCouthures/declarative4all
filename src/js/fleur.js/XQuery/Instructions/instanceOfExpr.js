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
		var a = new Fleur.Text();
		a.data = "false";
		a.schemaTypeInfo = Fleur.Type_boolean;
		if (seqtype.length === 2) {
			occurrence = seqtype[1][1][0];
		}
		if (n !== Fleur.EmptySequence) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (occurrence === "1" || occurrence === "?") {
					a.data = "false";
					Fleur.callback(function() {callback(a);});
				} else {
					var i = 0;
					var l = n.childNodes.length;
					var cb = function(n2) {
						if (n2 === Fleur.EmptySequence) {
							a.data = "false";
							Fleur.callback(function() {callback(a);});
							return;
						}
						i++;
						if (i === l) {
							a.data = "true";
							Fleur.callback(function() {callback(a);});
							return;
						}
						Fleur.XQueryEngine[seqtype[0][0]]({
							_curr: n.childNodes[i],
							env: ctx.env
						}, seqtype[0][1], cb);
					};
					Fleur.XQueryEngine[seqtype[0][0]]({
						_curr: n.childNodes[i],
						env: ctx.env
					}, seqtype[0][1], cb);
				}
			} else {
				Fleur.XQueryEngine[seqtype[0][0]]({
					_curr: n,
					env: ctx.env
				}, seqtype[0][1], function(n) {
					a.data = String(n !== Fleur.EmptySequence);
					Fleur.callback(function() {callback(a);});
				});
			}
		} else if (occurrence === "1" || occurrence === "+") {
			a.data = "false";
			Fleur.callback(function() {callback(a);});
		}
	});
};