"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Function = function(namespaceURI, nodeName, jsfunc, argtypes, rettype, specifics) {
  Fleur.Node.apply(this);
  if (namespaceURI && nodeName) {
    this._setNodeNameLocalNamePrefix(namespaceURI, nodeName);
  }
  this.jsfunc = jsfunc;
  this.argtypes = argtypes;
  this.rettype = rettype;
  this.nodeType = Fleur.Node.FUNCTION_NODE;
  Object.assign(this, specifics);
};
Fleur.Function.prototype = new Fleur.Node();