/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["true"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	var a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_boolean;
	a.data = "true";
	callback(a);
};