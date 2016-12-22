/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["temp-dir"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var result = new Fleur.Text();
	result.data = "";
	result.schemaTypeInfo = Fleur.Type_string;
	if (!global.os) {
		Fleur.callback(function() {callback(result);});
		return;
	}
	result.data = global.os.tmpdir();
	Fleur.callback(function() {callback(result);});
};