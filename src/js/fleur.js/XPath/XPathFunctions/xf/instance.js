"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xf_instance_0 = function() {
  this.itemstack.push(this.item);
  this.item = this.path.ownerDocument ? this.path.ownerDocument.documentElement : this.path.documentElement;
  this.addnodedep(this.item);
  return this;
};
Fleur.Context.prototype.xf_instance_1 = function() {
  const instance = document.getElementById(this.item.data);
  this.item = instance.xfElement.doc.documentElement;
  this.addnodedep(this.item);
  return this;
};

Fleur.XPathFunctions_xf["instance#0"] = new Fleur.Function("http://www.w3.org/2002/xforms", "xf:instance", Fleur.Context.prototype.xf_instance_0,
  [], Fleur.SequenceType_item_0n, {dynonly: true});
Fleur.XPathFunctions_xf["instance#1"] = new Fleur.Function("http://www.w3.org/2002/xforms", "xf:instance", Fleur.Context.prototype.xf_instance_1,
  [Fleur.SequenceType_string_1], Fleur.SequenceType_item_0n, {dynonly: true});