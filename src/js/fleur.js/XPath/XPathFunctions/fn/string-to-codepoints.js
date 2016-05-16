/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["string-to-codepoints"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var result, c;
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_string) {
			if (a.data.length === 0) {
				result = Fleur.EmptySequence;
			} else if (a.data.length === 1) {
				result = new Fleur.Text();
				result.schemaTypeInfo = Fleur.Type_integer;
				result.data = "" + a.data.codePointAt(0);
			} else {
				result = new Fleur.Sequence();
				var i, l;
				for (i = 0, l = a.data.length; i < l; i++) {
					c = new Fleur.Text();
					c.schemaTypeInfo = Fleur.Type_integer;
					c.data = "" + a.data.codePointAt(i);
					result.appendChild(c);
				}
			}
		} else {
			callback(Fleur.error(ctx, "FOCH0001"));
			return;
		}
		callback(result);
	});
};