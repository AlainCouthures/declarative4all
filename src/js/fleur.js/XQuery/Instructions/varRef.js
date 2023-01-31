"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_varRef = function(children, expectedSequenceType) {
  const nsURI = this.rs.nsresolver.lookupNamespaceURI(children[0][1].length === 1 ? "" : children[0][1][1][1][0]) || "";
  const vname = children[0][1][0];
  return this.inst("xqx_varRef('" + nsURI + "', '" + vname + "')", false, expectedSequenceType, null, this.rs.varresolver.get(null, nsURI, vname));
};

Fleur.Context.prototype.xqx_varRef = function(nsURI, vname) {
  this.itemstack.push(this.item);
  this.item = this.rs.varresolver.get(null, nsURI, vname);
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.varRef] = function(ctx, children, callback) {
  var nsURI;
  if (children[0][1].length === 1) {
    nsURI = "";
  } else {
    nsURI = children[0][1][1][1][0];
  }
  var lookupURI = nsURI === "" ? "" : ctx.env.nsresolver.lookupNamespaceURI(nsURI) || "";
  var n = ctx.env.varresolver.get(ctx, lookupURI, children[0][1][0]);
  //alert(children[0][1][0] + " -> " + n.data);
  Fleur.callback(function() {callback(n);});
};
*/