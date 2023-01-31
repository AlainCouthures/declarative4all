"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xf_context_0 = function() {
  this.itemstack.push(this.item);
  this.item = this.initialpath;
  return this;
};

Fleur.XPathFunctions_xf["context#0"] = new Fleur.Function("http://www.w3.org/2002/xforms", "xf:context", Fleur.Context.prototype.xf_context_0,
  [], Fleur.SequenceType_item_0n, {dynonly: true});