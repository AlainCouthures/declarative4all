/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["min"] = function(ctx, children) {
	if (children.length !== 1) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	var min, val, t = 0, comp;
	if (!ctx._result) {
		return;
	}
	if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	if (ctx._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		Fleur.Atomize(ctx);
		return;
	} else {
		var items = ctx._result.childNodes.slice(0);
		var i, l;
		i = 0;
		l = items.length;
		while (i < l) {
			ctx._result = items[i];
			Fleur.Atomize(ctx);
			if (!comp) {
				if (ctx._result.schemaTypeInfo === Fleur.Type_string || ctx._result.schemaTypeInfo === Fleur.Type_anyURI || ctx._result.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					comp = Fleur.Type_string;
				} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
					comp = Fleur.Type_string;
				} else {
					comp = Fleur.Type_double;
				}
			}
			if (comp === Fleur.Type_double) {
				val = Fleur.toJSNumber(ctx);
			} else {
				val = Fleur.toJSString(ctx);
			}
			if (val[0] < 0) {
				if (!comp) {
					comp = Fleur.Type_string;
					val = Fleur.toJSString(ctx);
				} else {
					Fleur.error("");
				}
			}
			if (!min) {
				t = val[0];
				min = val[1];
			} else {
				if (comp === Fleur.Type_double) {
					if (min > val[1]) {
						t = val[0];
						min = val[1];
					}
				} else if (min.localeCompare(val[1]) > 0) {
					min = val[1];
				}
			}
			i++;
		}
	}
	ctx._result.data = "" + min;
	ctx._result.schemaTypeInfo = comp === Fleur.Type_double ? Fleur.numericTypes[t] : Fleur.Type_string;
};