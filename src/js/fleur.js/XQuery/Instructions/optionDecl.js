/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.optionDecl] = function(ctx, children, callback) {
	if (!ctx.env.options) {
		ctx.env.options = {};
	}
	var uri = children[0][1].length > 1 ? ctx.env.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]) : "http://www.w3.org/2012/xquery";
	if (!ctx.env.options[uri]) {
		ctx.env.options[uri] = {};
	}
	ctx.env.options[uri][children[0][1][0]] = children[1][1][0];
	Fleur.callback(function() {callback();});
};