/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.nameTest] = function(ctx, children, callback) {
	//console.log("nameTest - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	if (ctx._curr.localName !== children[0]) {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	var nsURI;
	if (children.length === 1) {
		nsURI = "";
	} else {
		nsURI = children[1][1][0];
	}
	var currURI = ctx._curr.namespaceURI || null;
	if (currURI !== ctx.env.nsresolver.lookupNamespaceURI(nsURI) && currURI !== "http://www.w3.org/1999/xhtml") {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	Fleur.callback(function() {callback(ctx._curr);});
};
