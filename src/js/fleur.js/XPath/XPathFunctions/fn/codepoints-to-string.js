/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["codepoints-to-string"] = function(ctx, children) {
	var s = "";
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
	} else {
	}
	ctx._result = new Fleur.Text();
	ctx._result.schemaTypeInfo = Fleur.Type_string;
	ctx._result.data = s;
};