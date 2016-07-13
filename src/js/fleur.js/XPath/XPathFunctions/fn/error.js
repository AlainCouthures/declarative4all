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
		Fleur.callback(function() {callback(Fleur.error(ctx, "FOER0000"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "FOER0000"));});
		} else if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
		} else if (a1.schemaTypeInfo !== Fleur.Type_QName) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
		} else {
			a1.schemaTypeInfo = Fleur.Type_error;
			if (children.length === 1) {
				Fleur.callback(function() {callback(a1);});
			} else {
				Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
					var a2 = Fleur.Atomize(n);
					a1.data = a2.data;
					Fleur.callback(function() {callback(a1);});
				});
			}
		}
	});
};
