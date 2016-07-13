/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_math["pi"] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	a.schemaTypeInfo = Fleur.Type_double;
	a.data = "3.141592653589793e0";
	Fleur.callback(function() {callback(a);});
};