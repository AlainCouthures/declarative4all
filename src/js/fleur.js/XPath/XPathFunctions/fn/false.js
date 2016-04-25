/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["false"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	var result = new Fleur.Text();
	result.schemaTypeInfo = Fleur.Type_boolean;
	result.data = "false";
	callback(result);
};