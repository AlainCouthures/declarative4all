/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["name"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSString(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		var result = new Fleur.Text();
		result.schemaTypeInfo = Fleur.Type_string;
		var spl = op1[1].replace("\\", "/").split("/");
		if (spl.length > 0) {
			result.data = spl[spl.length - 1];
		} else {
			result.data = "";
		}
		Fleur.callback(function() {callback(result);});
	});
};