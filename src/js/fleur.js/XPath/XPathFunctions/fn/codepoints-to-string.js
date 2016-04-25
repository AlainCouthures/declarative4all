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
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
		} else {
		}
		n = new Fleur.Text();
		n.schemaTypeInfo = Fleur.Type_string;
		n.data = s;
		callback(n);
	});
};