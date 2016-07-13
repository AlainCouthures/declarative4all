/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.elementContent] = function(ctx, children, callback, elt) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
		} else {
			elt.appendContent(n, "");
			if (children.length > 1) {
				Fleur.XQueryEngine[Fleur.XQueryX.elementContent](ctx, children.slice(1), function(n) {
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(elt);});
			}
		}
	});
};