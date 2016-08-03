/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.varRef] = function(ctx, children, callback) {
	var n = ctx.env.varresolver.get(ctx, "", children[0][1][0]);
	//alert(children[0][1][0] + " -> " + n.data);
	Fleur.callback(function() {callback(n);});
};