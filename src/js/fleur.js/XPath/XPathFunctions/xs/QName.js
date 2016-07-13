/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["QName"] = function(ctx, children, callback) {
	var namespaceURI, qualifiedName, a;
	if (children.length === 1) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
			namespaceURI = "";
			qualifiedName = n.data;
			a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_QName;
			a._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
			Fleur.callback(function() {callback(a);});
		});
	} else if (children.length === 2) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
			namespaceURI = n.data;
			Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
				qualifiedName = n.data;
				a = new Fleur.Text();
				a.schemaTypeInfo = Fleur.Type_QName;
				a._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
				Fleur.callback(function() {callback(a);});
			});
		});
	} else {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
	}
};