/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["not"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var boolean;
		if (n === Fleur.EmptySequence) {
			boolean = "true";
		} else {
			if (n.schemaTypeInfo === Fleur.Type_error) {
				callback(n);
				return;
			}
			var a = Fleur.Atomize(n);
			if (a.schemaTypeInfo === Fleur.Type_boolean) {
				boolean = a.data === "true" ? "false" : "true";
			} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
				boolean = a.childNodes.length !== 0 ? "false" : "true";
			} else if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				boolean = (a.data && a.data.length !== 0) ? "false" : "true";
			} else if (a.schemaTypeInfo === Fleur.Type_integer || a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
				boolean = (a.data !== "0" && a.data !== "0.0" && a.data !== "0.0e0" && a.data !== "NaN") ? "false" : "true";
			} else {
				callback(Fleur.error(ctx, "FORG0006"));
				return;
			}
		}
		a.data = boolean;
		a.schemaTypeInfo = Fleur.Type_boolean;
		callback(a);
	});
};