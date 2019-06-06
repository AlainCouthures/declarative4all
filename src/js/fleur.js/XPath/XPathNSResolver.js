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
		"xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"xf": "http://www.w3.org/2002/xforms",
		" function": "http://www.w3.org/2005/xpath-functions",
		"fn": "http://www.w3.org/2005/xpath-functions",
		"local": "http://www.w3.org/2005/xquery-local-functions",
		"math": "http://www.w3.org/2005/xpath-functions/math",
		"map": "http://www.w3.org/2005/xpath-functions/map",
		"array": "http://www.w3.org/2005/xpath-functions/array",
		"err": "http://www.w3.org/2005/xqt-errors",
		"b": "http://xqib.org",
		"bin": "http://expath.org/ns/binary",
		"file": "http://expath.org/ns/file",
		"http": "http://expath.org/ns/http-client",
		"request": "http://exquery.org/ns/request",
		"prof": "http://basex.org/modules/prof",
		"proc": "http://basex.org/modules/proc",
		"js": "http://www.w3.org/standards/webdesign/script",
		"fleur": "http://www.agencexml.com/fleur",
		"dgram": "http://www.agencexml.com/fleur/dgram",
		"internal": "http://www.agencexml.com/fleur/internal",
		"ietf": "https://tools.ietf.org/rfc/index",
		"excel": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
		"zip": "http://expath.org/ns/zip",
		"matrix": "http://www.mathunion.org/matrix",
		"xpath": "http://www.w3.org/2005/xpath",
		"xquery": "http://www.w3.org/2005/xquery"
	};
	this.uri2pf = {
		"http://www.w3.org/XML/1998/namespace": "xml",
		"http://www.w3.org/2000/xmlns/": "xmlns",
		"http://www.w3.org/2001/XMLSchema": "xs",
		"http://www.w3.org/2001/XMLSchema-instance": "xsi",
		"http://www.w3.org/2002/xforms": "xf",
		"http://www.w3.org/2005/xpath": "xpath",
		"http://www.w3.org/2005/xpath-functions": "fn",
		"http://www.w3.org/2005/xpath-functions/math": "math",
		"http://www.w3.org/2005/xpath-functions/map": "map",
		"http://www.w3.org/2005/xpath-functions/array": "array",
		"http://www.w3.org/2005/xqt-errors": "err",
		"http://www.w3.org/2005/xquery": "xquery",
		"http://xqib.org": "b",
		"http://expath.org/ns/binary": "bin",
		"http://expath.org/ns/file": "file",
		"http://expath.org/ns/http-client": "http",
		"http://exquery.org/ns/request": "request",
		"http://basex.org/modules/prof": "prof",
		"http://basex.org/modules/proc": "proc",
		"http://www.w3.org/standards/webdesign/script": "js",
		"http://www.agencexml.com/fleur": "fleur",
		"http://www.agencexml.com/fleur/dgram": "dgram",
		"http://www.agencexml.com/fleur/internal": "internal",
		"https://tools.ietf.org/rfc/index": "ietf",
		"http://schemas.openxmlformats.org/spreadsheetml/2006/main": "excel",
		"http://expath.org/ns/zip": "zip",
		"http://www.mathunion.org/matrix": "matrix"
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
			this.uri2pf[uri] = prefix;
		}
	}
	return uri;
};
Fleur.XPathNSResolver.prototype.lookupPrefix = function(namespaceURI) {
	var pf;
	if (this.uri2pf[namespaceURI]) {
		return this.uri2pf[namespaceURI];
	}
	if (this.node) {
		pf = this.node.lookupPrefix(namespaceURI);
		if (pf) {
			this.pf2uri[pf] = namespaceURI;
			this.uri2pf[namespaceURI] = pf;
		}
	}
	return pf;
};

Fleur.XPathNSResolver.prototype.declareNamespace = function(prefix, uri) {
	this.pf2uri[prefix] = uri;
};