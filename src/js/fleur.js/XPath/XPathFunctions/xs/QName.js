/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["QName"] = function(ctx, children) {
	var namespaceURI, qualifiedName;
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	namespaceURI = ctx._result.data;
	Fleur.XQueryEngine[children[1][0]](ctx, children[1][1]);
	qualifiedName = ctx._result.data;
	ctx._result = new Fleur.Text();
	ctx._result.schemaTypeInfo = Fleur.Type_QName;
	ctx._result._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
};