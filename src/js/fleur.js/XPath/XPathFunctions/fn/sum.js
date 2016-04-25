/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["sum"] = function(ctx, children, callback) {
	if (children.length !== 1 && children.length !== 2) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var sum = 0, val, t = 0, a;
		if (n !== Fleur.EmptySequence) {
			if (n.schemaTypeInfo === Fleur.Type_error) {
				callback(n);
				return;
			}
			if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				a = Fleur.Atomize(n);
				val = Fleur.toJSNumber(a);
				t = val[0];
				if (t < 0) {
					sum = NaN;
					t = 0;
				} else {
					sum = val[1];
				}
			} else {
				var items = n.childNodes;
				var i, l;
				i = 0;
				l = items.length;
				while (i < l) {
					a = Fleur.Atomize(items[i]);
					val = Fleur.toJSNumber(a);
					if (val[0] < 0) {
						sum = NaN;
						t = 0;
						break;
					}
					sum += val[1];
					t = Math.max(t, val[0]);
					i++;
				}
			}
		} else {
			a = new Fleur.Text();
		}
		if (sum === 0 && children.length === 2) {
			Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
				callback(Fleur.Atomize(n));
			});
		} else {
			a.data = "" + sum;
			a.schemaTypeInfo = Fleur.numericTypes[t];
			callback(a);
		}
	});
};