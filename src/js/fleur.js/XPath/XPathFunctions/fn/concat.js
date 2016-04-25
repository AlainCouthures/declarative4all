/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["concat"] = function(ctx, children, callback) {
	var result = new Fleur.Text();
	result.schemaTypeInfo = Fleur.Type_string;
/*
	if (children.length < 2) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
*/
	var cb = function(n, eob) {
		var a = Fleur.Atomize(n);
		if (eob) {
			if (n !== Fleur.EmptySequence) {
				result.data += a.data;
			}
			callback(result, true);
			return;
		}
		if (children.length === 1) {
			callback(n, true);
			return;
		}
		if (a.data) {
			result.data = a.data;
		}
		Fleur.XPathFunctions_fn["concat"](ctx, children.slice(1), cb);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};