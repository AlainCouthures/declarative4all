/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.elementConstructor] = function(ctx, children, callback) {
	var elt = new Fleur.Element();
	elt.nodeName = children[0][1][0];
	elt.namespaceURI = null;
	elt.localName = children[0][1][0];
	if (children[0][1].length === 2) {
		elt.prefix = children[0][1][1][1][0];
	} else {
		elt.prefix = null;
	}
	elt.childNodes = new Fleur.NodeList();
	elt.children = new Fleur.NodeList();
	elt.textContent = "";
	if (children.length > 1) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			elt.namespaceURI = elt.lookupNamespaceURI(elt.prefix);
			if (children.length > 2) {
				Fleur.XQueryEngine[children[2][0]](ctx, children[2][1], function(n) {
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(n);});
			}
		}, elt);
	} else {
		elt.namespaceURI = elt.lookupNamespaceURI(elt.prefix);
		Fleur.callback(function() {callback(elt);});
	}
};