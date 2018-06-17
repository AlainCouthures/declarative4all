/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.computedEntryConstructor] = function(ctx, children, callback) {
	var entry = new Fleur.Entry();
	if (children[0][0] === Fleur.XQueryX.tagName) {
		entry.name = children[0][1][0];
		entry.namespaceURI = null;
		entry.nodeName = children[0][1][0];
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			entry.appendChild(n);
			Fleur.callback(function() {callback(entry);});
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				entry.nodeName = a.data;
				entry.namespaceURI = null;
				entry.localName = a.data;
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					entry.appendChild(n.copyNode());
					Fleur.callback(function() {callback(entry);});
				});
			}
		});
	}
};