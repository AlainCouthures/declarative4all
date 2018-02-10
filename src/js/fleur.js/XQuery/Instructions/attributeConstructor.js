/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.attributeConstructor] = function(ctx, children, callback, elt) {
	var attr = new Fleur.Attr();
	var t;
	attr.nodeName = children[0][1][0];
	attr.localName = children[0][1][0];
	if (children[0][1].length === 2) {
		attr.prefix = children[0][1][1][1][0];
	} else {
		attr.prefix = null;
	}
	attr.namespaceURI = elt.lookupNamespaceURI(attr.prefix);
	if (children[1][0] === Fleur.XQueryX.attributeValue) {
		if (children[1][1].length !== 0) {
			t = new Fleur.Text();
			t.data = children[1][1][0];
			attr.appendChild(t);
		}
		Fleur.callback(function() {callback(attr);});
	} else {
		t = new Fleur.Text();
		t.data = "";
		attr.appendChild(t);
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			Fleur.callback(function() {callback(n);});
		}, attr);
	}
};