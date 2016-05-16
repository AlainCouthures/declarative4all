/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["index-of"] = function(ctx, children, callback) {
	if (children.length === 3) {
		callback(Fleur.error(ctx, "FOCH0002"));
		return;
	}
	if (children.length !== 2) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence || a1.schemaTypeInfo === Fleur.Type_error) {
			callback(a1);
			return;
		}
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				callback(a2);
				return;
			}
			if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
				callback(Fleur.error(ctx, "XPTY0004"));
				return;
			}
			if (Fleur.numericTypes.indexOf(a2.schemaTypeInfo) !== -1) {
				a2.schemaTypeInfo = Fleur.Type_double;
			} else if (a2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				a2.schemaTypeInfo = Fleur.Type_string;
			}
			if (a1.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				if (Fleur.numericTypes.indexOf(a1.schemaTypeInfo) !== -1) {
					a1.schemaTypeInfo = Fleur.Type_double;
				} else if (a1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					a1.schemaTypeInfo = Fleur.Type_string;
				}
				if (a1.schemaTypeInfo === Fleur.Type_string && a2.schemaTypeInfo === Fleur.Type_string ?
					a1.data.localeCompare(a2.data) === 0 :
					a1.schemaTypeInfo === a2.schemaTypeInfo && a1.data === a2.data) {
					a2.schemaTypeInfo = Fleur.Type_integer;
					a2.data = "1";
					callback(a2);
					return;
				}
				callback(Fleur.EmptySequence);
				return;
			}
			var result = new Fleur.Sequence();
			a1.childNodes.forEach(function(c, i) {
				if (c.schemaTypeInfo === Fleur.Type_string && a2.schemaTypeInfo === Fleur.Type_string ?
					c.data.localeCompare(a2.data) === 0 :
					c.schemaTypeInfo === c.schemaTypeInfo && c.data === a2.data) {
						var b = new Fleur.Text();
						b.schemaTypeInfo = Fleur.Type_integer;
						b.data = "" + (i + 1);
						result.appendChild(b);
				}
			});
			if (result.childNodes.length === 0) {
				result = Fleur.EmptySequence;
			} else if (result.childNodes.length === 1) {
				result = result.childNodes[0];
			}
			callback(result);
		});
	});
};