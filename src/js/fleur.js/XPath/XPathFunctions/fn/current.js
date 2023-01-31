"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_current_0 = function() {
  this.itemstack.push(this.item);
  this.item = this.initialpath;
  return this;
};

Fleur.XPathFunctions_fn["current#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current", Fleur.Context.prototype.fn_current_0,
  [], Fleur.SequenceType_item_01);
/*
  function(ctx) {
    return ctx._item || ctx._curr;
  },
  null, [], true, false, {type: Fleur.Node});
*/