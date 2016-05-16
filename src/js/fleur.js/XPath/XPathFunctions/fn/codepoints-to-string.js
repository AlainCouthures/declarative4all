/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["codepoints-to-string"] = function(ctx, children, callback) {
	var s = "";
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		var i, l, code;
		if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
			for (i = 0, l = a.childNodes.length; i < l; i++) {
				if (a.childNodes[i].schemaTypeInfo === Fleur.Type_integer) {
					code = parseInt(a.childNodes[i].data, 10);
					if (code < 0 || code > 65535) {
						callback(Fleur.error(ctx, "FOCH0001"));
						return;
					}
					s += String.fromCodePoint(code);
				} else {
					callback(Fleur.error(ctx, "XPTY0004"));
					return;
				}
			}
		} else {
			if (a.schemaTypeInfo === Fleur.Type_integer) {
				code = parseInt(a.data, 10);
				if (code < 0 || code > 65535) {
					callback(Fleur.error(ctx, "FOCH0001"));
					return;
				}
				s = String.fromCodePoint(code);
			} else {
				callback(Fleur.error(ctx, "XPTY0004"));
				return;
			}
		}
		a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_string;
		a.data = s;
		callback(a);
	});
};