/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["false"] = function(ctx, children) {
	ctx._result = new Fleur.Text();
	if (children.length !== 0) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	ctx._result.schemaTypeInfo = Fleur.Type_boolean;
	ctx._result.data = "false";
};