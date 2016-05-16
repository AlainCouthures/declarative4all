/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["distinct-values"] = function(ctx, children, callback) {
	if (children.length === 2) {
		callback(Fleur.error(ctx, "FOCH0002"));
		return;
	}
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence) {
			callback(a);
			return;
		}
		if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = new Fleur.Sequence();
			a.childNodes.forEach(function(c) {
				if (!result.childNodes.some(function(r) {
						if ((c.schemaTypeInfo === Fleur.Type_string || c.schemaTypeInfo === Fleur.Type_untypedAtomic) &&
							(r.schemaTypeInfo === Fleur.Type_string || r.schemaTypeInfo === Fleur.Type_untypedAtomic)) {
							return c.data === r.data;
						}
						if (Fleur.numericTypes.indexOf(c.schemaTypeInfo) !== -1 &&
							Fleur.numericTypes.indexOf(r.schemaTypeInfo) !== -1) {
							return (c.data === "INF" && r.data === "INF") ||
								(c.data === "-INF" && r.data === "-INF") ||
								(c.data === "NaN" && r.data === "NaN") ||
								parseFloat(c.data) === parseFloat(r.data);
						}
						return c.schemaTypeInfo === r.schemaTypeInfo && c.data === r.data;
					})) {
					result.appendChild(c);
				}
			});
			if (result.childNodes.length === 1) {
				result = result.childNodes[0];
			}
			callback(result);
		} else {
			callback(a);
		}
	});
};