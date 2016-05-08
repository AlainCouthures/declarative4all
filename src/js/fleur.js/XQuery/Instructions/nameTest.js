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
		callback(Fleur.EmptySequence);
		return;
	}
	var nsURI;
	if (children.length === 1) {
		nsURI = "";
	} else {
		nsURI = children[1][1][0];
	}
	var currURI = ctx._curr.namespaceURI || null;
	if (currURI !== ctx.nsresolver.lookupNamespaceURI(nsURI)) {
		callback(Fleur.EmptySequence);
		return;
	}
	callback(ctx._curr);
};
