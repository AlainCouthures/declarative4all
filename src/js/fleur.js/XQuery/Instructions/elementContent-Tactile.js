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
			callback(n);
		} else {
			if (elt.lastChild && elt.lastChild.nodeType === Fleur.Node.TEXT_NODE) {
				elt.lastChild.data += n.data;
			} else {
				var a = Fleur.Atomize(n);
				elt.appendChild(a);
			}
			if (children.length > 1) {
				Fleur.XQueryEngine[Fleur.XQueryX.elementContent](ctx, children.slice(1), function(n) {
					callback(n);
				}, elt);
			} else {
				callback(elt);
			}
		}
	});
};