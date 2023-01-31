"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xqx_paramList = function() {
  this.rs.varresolver = new Fleur.varMgr([], this.rs.varresolver);
  return this;
};

Fleur.Context.prototype.xqx_paramList_drop = function() {
  this.rs.varresolver = this.rs.varresolver.previous;
  return this;
};