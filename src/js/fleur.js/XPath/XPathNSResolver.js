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
		"xmlns": "http://www.w3.org/2000/xmlns/",
		"xs": "http://www.w3.org/2001/XMLSchema",
		" function": "http://www.w3.org/2005/xpath-functions",
		"fn": "http://www.w3.org/2005/xpath-functions",
		"math": "http://www.w3.org/2005/xpath-functions/math",
		"map": "http://www.w3.org/2005/xpath-functions/map",
		"array": "http://www.w3.org/2005/xpath-functions/array",
		"err": "http://www.w3.org/2005/xqt-errors",
		"b": "http://xqib.org/browser",
		"file": "http://expath.org/ns/file",
		"prof": "http://basex.org/modules/prof",
		"proc" : "http://basex.org/modules/proc"
	};
	this.node = node;
};
Fleur.XPathNSResolver.prototype.lookupNamespaceURI = function(prefix) {
	var uri;
	if (this.pf2uri[prefix]) {
		return this.pf2uri[prefix];
	}
	if (this.node) {
		uri = this.node.lookupNamespaceURI(prefix);
		if (uri) {
			this.pf2uri[prefix] = uri;
		}
	}
	return uri;
};

Fleur.XPathNSResolver.prototype.declareNamespace = function(prefix, uri) {
	this.pf2uri[prefix] = uri;
};