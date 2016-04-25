/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["error"] = function(ctx, children, callback) {
	if (children.length === 0) {
		callback(Fleur.error(ctx, "FOER0000"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence) {
			callback(Fleur.error(ctx, "FOER0000"));
		} else if (a.schemaTypeInfo === Fleur.Type_error) {
			callback(a);
		} else if (a.schemaTypeInfo !== Fleur.Type_QName) {
			callback(Fleur.error(ctx, "XPTY0004"));
		} else {
			a.schemaTypeInfo = Fleur.Type_error;
			callback(a);
		}
	});
};
