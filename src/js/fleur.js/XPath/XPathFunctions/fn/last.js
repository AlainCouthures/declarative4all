"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_last_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.data = String(this.last);
  item.schemaTypeInfo = Fleur.Type_integer;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["last#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:last", Fleur.Context.prototype.fn_last_0,
  [], Fleur.SequenceType_integer_1);
/*
  function(ctx) {
    return ctx._last;
  },
  null, [], true, false, {type: Fleur.Type_integer});
*/