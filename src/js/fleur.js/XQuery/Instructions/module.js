/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.module] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		ctx._result = n;
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.module](ctx, children.slice(1), callback);
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};