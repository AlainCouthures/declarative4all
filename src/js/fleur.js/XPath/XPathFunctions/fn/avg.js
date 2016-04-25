/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["avg"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var sum = 0, val, t = 0, l = 1, a;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
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
			var items = n.childNodes.slice(0);
			var i;
			i = 0;
			l = items.length;
			t = 3;
			while (i < l) {
				n = items[i];
				a = Fleur.Atomize(n);
				val = Fleur.toJSNumber(a);
				if (val[0] < 0) {
					sum = NaN;
					break;
				}
				sum += val[1];
				i++;
			}
		}
		a.data = ("" + (sum / l)).replace("e+", "e");
		a.schemaTypeInfo = Fleur.numericTypes[t];
		callback(a);
	});
};