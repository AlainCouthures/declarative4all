/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["sum"] = function(ctx, children) {
	if (children.length !== 1 && children.length !== 2) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	var sum = 0, val, t = 0;
	if (ctx._result) {
		if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
			return;
		}
		if (ctx._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			Fleur.Atomize(ctx);
			val = Fleur.toJSNumber(ctx);
			t = val[0];
			if (t < 0) {
				sum = NaN;
				t = 0;
			} else {
				sum = val[1];
			}
		} else {
			var items = ctx._result.childNodes.slice(0);
			var i, l;
			i = 0;
			l = items.length;
			while (i < l) {
				ctx._result = items[i];
				Fleur.Atomize(ctx);
				val = Fleur.toJSNumber(ctx);
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
		ctx._result = new Fleur.Text();
	}
	if (sum === 0 && children.length === 2) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1]);
		Fleur.Atomize(ctx);
	} else {
		ctx._result.data = "" + sum;
		ctx._result.schemaTypeInfo = Fleur.numericTypes[t];
	}
};