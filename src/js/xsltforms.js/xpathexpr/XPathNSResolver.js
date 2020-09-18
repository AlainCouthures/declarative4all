/*eslint-env browser*/
/*globals XsltForms_globals Fleur*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module FleurConv
 * @description  === XsltForms_FleurConv ===
 * Converter from Fleur XQuery parser result to XPath engine
 */

Fleur.XPathNSResolver_default = {
	pf: [
		"xml",
		"xmlns",
		"xs",
		"xsd",
		"xsd_",
		"xsi",
		"xf",
		"xforms",
		"xsltforms",
		" function",
		"fn",
		"local",
		"math",
		"map",
		"array",
		"err",
		"b",
		"bin",
		"file",
		"http",
		"request",
		"prof",
		"proc",
		"js",
		"fleur",
		"dgram",
		"base64",
		"internal",
		"unit",
		"ietf",
		"excel",
		"zip",
		"matrix",
		"xpath",
		"xquery"
	],
	uri: [
		"http://www.w3.org/XML/1998/namespace",
		"http://www.w3.org/2000/xmlns/",
		"http://www.w3.org/2001/XMLSchema",
		"http://www.w3.org/2001/XMLSchema",
		"http://www.w3.org/2001/XMLSchema",
		"http://www.w3.org/2001/XMLSchema-instance",
		"http://www.w3.org/2002/xforms",
		"http://www.w3.org/2002/xforms",
		"http://www.agencexml.com/xsltforms",
		"http://www.w3.org/2005/xpath-functions",
		"http://www.w3.org/2005/xpath-functions",
		"http://www.w3.org/2005/xpath",
		"http://www.w3.org/2005/xpath-functions/math",
		"http://www.w3.org/2005/xpath-functions/map",
		"http://www.w3.org/2005/xpath-functions/array",
		"http://www.w3.org/2005/xqt-errors",
		"http://xqib.org",
		"http://expath.org/ns/binary",
		"http://expath.org/ns/file",
		"http://expath.org/ns/http-client",
		"http://exquery.org/ns/request",
		"http://basex.org/modules/prof",
		"http://basex.org/modules/proc",
		"http://www.w3.org/standards/webdesign/script",
		"http://www.agencexml.com/fleur",
		"http://www.agencexml.com/fleur/dgram",
		"http://www.agencexml.com/fleur/base64",
		"http://www.agencexml.com/fleur/internal",
		"http://www.agencexml.com/fleur/unit",
		"https://tools.ietf.org/rfc/index",
		"http://schemas.openxmlformats.org/spreadsheetml/2006/main",
		"http://expath.org/ns/zip",
		"http://www.mathunion.org/matrix",
		"http://www.w3.org/2005/xpath",
		"http://www.w3.org/2005/xquery"
	]
};

Fleur.XPathNSResolver = function(node) {
	this.pf = Fleur.XPathNSResolver_default.pf.slice();
	this.uri = Fleur.XPathNSResolver_default.uri.slice();
	this.node = node;
};
Fleur.XPathNSResolver.prototype.lookupNamespaceURI = function(prefix) {
	var uri;
	var index = this.pf.lastIndexOf(prefix);
	if (index !== -1) {
		return this.uri[index];
	}
	if (this.node) {
		uri = this.node.lookupNamespaceURI(prefix);
		if (uri) {
			this.pf.push(prefix);
			this.uri.push(uri);
		}
	}
	return uri;
};
Fleur.XPathNSResolver.prototype.lookupPrefix = function(namespaceURI) {
	var pf;
	var index = this.uri.lastIndexOf(namespaceURI);
	if (index !== -1) {
		return this.pf[index];
	}
	if (this.node) {
		pf = this.node.lookupPrefix(namespaceURI);
		if (pf) {
			this.pf.push(pf);
			this.uri.push(namespaceURI);
		}
	}
	return pf;
};

Fleur.XPathNSResolver.prototype.declareNamespace = function(prefix, uri) {
	this.pf.push(prefix);
	this.uri.push(uri);
};