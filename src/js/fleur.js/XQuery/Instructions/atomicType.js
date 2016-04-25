/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.atomicType] = function(ctx, children, callback) {
	if (!ctx._curr.schemaTypeInfo) {
		callback(Fleur.EmptySequence);
	}
	var localname = children[0];
	var prefix = children[1][1][0];
	var namespace = ctx.nsresolver.lookupNamespaceURI(prefix);
	if (localname !== ctx._curr.schemaTypeInfo.typeName || namespace !== ctx._curr.schemaTypeInfo.typeNamespace) {
		callback(ctx._curr);
	}
};