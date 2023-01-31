"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xqx_param = function(namespaceURI, vname) {
  this.rs.varresolver.set(null, namespaceURI, vname, this.item);
  this.item = this.itemstack.pop();
  return this;
};