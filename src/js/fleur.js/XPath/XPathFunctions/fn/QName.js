/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["QName"] = function(ctx, children, callback) {
	if (children.length !== 2) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var namespaceURI = n.data;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var qualifiedName = n.data;
			var a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_QName;
			a._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
			callback(a);
		});
	});
};