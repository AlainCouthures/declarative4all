/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathNSResolver = function(node) {
	this.pf2uri = {
		"xml": "http://www.w3.org/XML/1998/namespace",
		"xmlns": "http://www.w3.org/2000/xmlns/"
	};
	this.node = node;
};
Fleur.XPathNSResolver.prototype.lookupNamespaceURI = function(prefix) {
	var uri;
	if (this.pf2uri[prefix]) {
		return this.pf2uri[prefix];
	}
	uri = this.node.lookupNamespaceURI(prefix);
	if (uri) {
		this.pf2uri[prefix] = uri;
	}
	return uri;
};