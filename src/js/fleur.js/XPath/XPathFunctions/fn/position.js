/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["position"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_integer;
	a.data = String(ctx._pos);
	Fleur.callback(function() {callback(a);});
};