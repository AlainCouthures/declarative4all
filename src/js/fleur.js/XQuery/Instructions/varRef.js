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
	var nsURI;
	if (children[0][1].length === 1) {
		nsURI = "";
	} else {
		nsURI = children[0][1][1][1][0];
	}
	var lookupURI = nsURI === "" ? "" : ctx.env.nsresolver.lookupNamespaceURI(nsURI) || "";
	var n = ctx.env.varresolver.get(ctx, lookupURI, children[0][1][0]);
	//alert(children[0][1][0] + " -> " + n.data);
	Fleur.callback(function() {callback(n);});
};