/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.namespaceDeclaration] = function(ctx, children, callback) {
	var attr = new Fleur.Attr();
	var t;
	if (children[0][0] === Fleur.XQueryX.prefixElt) {
		attr.localName = children[0][1][0];
		attr.nodeName = "xmlns:" + attr.localName;
		attr.namespaceURI = "http://www.w3.org/2000/xmlns/";
		attr.prefix = "xmlns";
		t = new Fleur.Text();
		t.data = children[1][1][0];
		attr.appendChild(t);
	} else {
		attr.localName = "xmlns";
		attr.nodeName = "xmlns";
		attr.namespaceURI = "http://www.w3.org/XML/1998/namespace";
		if (children[0][1].length !== 0) {
			t = new Fleur.Text();
			t.data = children[0][1][0];
			attr.appendChild(t);
		}
	}
	Fleur.callback(function() {callback(attr);});
};