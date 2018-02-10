/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Function = function(namespaceURI, nodeName, jsfunc, xqxfunc, argtypes, needctx, needcallback, restype, updating) {
	Fleur.Node.apply(this);
	if (namespaceURI && nodeName) {
		this._setNodeNameLocalNamePrefix(namespaceURI, nodeName);
	}
	this.jsfunc = jsfunc;
	this.xqxfunc = xqxfunc;
	this.argtypes = argtypes;
	this.needctx = needctx;
	this.needcallback = needcallback;
	this.restype = restype;
	this.updating = Boolean(updating);
	this.nodeType = Fleur.Node.FUNCTION_NODE;
};
Fleur.Function.prototype = new Fleur.Node();