/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["count"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var count, res;
		if (n === Fleur.EmptySequence) {
			count = 0;
		} else if (n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.ARRAY_NODE) {
			count = 1;
		} else {
			count = n.childNodes.length;
		}
		res = new Fleur.Text();
		res.data = "" + count;
		res.schemaTypeInfo = Fleur.Type_integer;
		callback(res);
	});
};