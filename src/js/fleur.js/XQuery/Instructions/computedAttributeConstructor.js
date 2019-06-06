/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.computedAttributeConstructor] = function(ctx, children, callback) {
	var attr = new Fleur.Attr();
	if (children[0][0] === Fleur.XQueryX.tagName) {
		attr.name = children[0][1][0];
		attr.namespaceURI = null;
		attr.nodeName = children[0][1][0];
		attr.localName = children[0][1][0];
		if (children[1][1].length === 0) {
			Fleur.callback(function() {callback(attr);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			attr.appendChild(n);
			Fleur.callback(function() {callback(attr);});
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				attr.name = a.data;
				attr.nodeName = a.data;
				attr.namespaceURI = null;
				attr.localName = a.data;
				if (children[1][1].length === 0) {
					Fleur.callback(function() {callback(attr);});
					return;
				}
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					attr.appendChild(n);
					Fleur.callback(function() {callback(attr);});
				});
			}
		});
	}
};