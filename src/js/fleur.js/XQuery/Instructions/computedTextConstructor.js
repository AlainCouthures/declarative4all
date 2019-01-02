/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.computedTextConstructor] = function(ctx, children, callback) {
	var txt = new Fleur.Text();
	txt.data = "";
	txt.schemaTypeInfo = Fleur.Type_string;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a = Fleur.Atomize(n);
		txt.data = a.data;
		txt.schemaTypeInfo = n.schemaTypeInfo;
		Fleur.callback(function() {callback(txt);});
	});
};