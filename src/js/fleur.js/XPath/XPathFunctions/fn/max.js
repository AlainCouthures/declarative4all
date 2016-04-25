/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["max"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var max, val, t = 0, comp;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			callback(n);
			return;
		}
		if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			callback(Fleur.Atomize(n));
			return;
		} else {
			var items = n.childNodes, a;
			var i, l;
			i = 0;
			l = items.length;
			while (i < l) {
				a = Fleur.Atomize(items[i]);
				if (!comp) {
					if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
						comp = Fleur.Type_string;
					} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
						comp = Fleur.Type_string;
					} else {
						comp = Fleur.Type_double;
					}
				}
				if (comp === Fleur.Type_double) {
					val = Fleur.toJSNumber(a);
				} else {
					val = Fleur.toJSString(a);
				}
				if (val[0] < 0) {
					if (!comp) {
						comp = Fleur.Type_string;
						val = Fleur.toJSString(a);
					} else {
						Fleur.error("");
					}
				}
				if (!max) {
					t = val[0];
					max = val[1];
				} else {
					if (comp === Fleur.Type_double) {
						if (max < val[1]) {
							t = val[0];
							max = val[1];
						}
					} else if (max.localeCompare(val[1]) < 0) {
						max = val[1];
					}
				}
				i++;
			}
		}
		a.data = "" + max;
		a.schemaTypeInfo = comp === Fleur.Type_double ? Fleur.numericTypes[t] : Fleur.Type_string;
		callback(a);
	});
};