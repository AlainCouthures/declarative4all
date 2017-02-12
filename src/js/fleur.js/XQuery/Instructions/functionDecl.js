/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.functionDecl] = function(ctx, children, callback) {
	var fname = children[0][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var prefix = null;
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix) {
			prefix = children[0][1][1][1][0];
			uri = ctx.env.nsresolver.lookupNamespaceURI(prefix);
		}
	}
	var args = children[1][1].map(function(arg) {
		var o = {name: arg[1][0][1][0]};
		if (arg[1].length === 1) {
			o.type = Fleur.Node;
			o.occurence = "*";
		}
		return o;
	});
	var fbody, fret;
	if (children[2][0] === Fleur.XQueryX.typeDeclaration) {
		fret = children[2][1][0];
		fbody = children[3][1][0];
	} else {
		fret = {type: Fleur.Node, occurence: "*"};
		fbody = children[2][1][0];
	}
	if (!Fleur.XPathFunctions[uri]) {
		Fleur.XPathFunctions[uri] = {};
	}
	Fleur.XPathFunctions[uri][fname + "#" + String(args.length)] = new Fleur.Function(uri, prefix ? prefix + ":" + fname : fname, null, fbody, args, false, false, fret);
	Fleur.callback(function() {callback();});
};