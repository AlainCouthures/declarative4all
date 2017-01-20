/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Function = function(namespaceURI, localName, jsfunc, xqxfunc, argtypes, needctx, needcallback, restype) {
	Fleur.Node.apply(this);
	this.namespaceURI = namespaceURI;
	this.localName = localName;
	this.jsfunc = jsfunc;
	this.xqxfunc = xqxfunc;
	this.argtypes = argtypes;
	this.needctx = needctx;
	this.needcallback = needcallback;
	this.restype = restype;
};
Fleur.Function.prototype = new Fleur.Node();