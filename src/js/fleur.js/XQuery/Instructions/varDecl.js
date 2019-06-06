/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.varDecl] = function(ctx, children, callback) {
	var vname = children[0][1][0];
	var uri = "";
	var prefix = null;
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix) {
			prefix = children[0][1][1][1][0];
			uri = ctx.env.nsresolver.lookupNamespaceURI(prefix);
		}
	}
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
		ctx.env.globalvarresolver.set(ctx, uri, vname, n);
		Fleur.callback(function() {callback();});
	});
};