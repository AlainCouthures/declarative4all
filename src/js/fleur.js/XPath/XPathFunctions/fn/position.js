"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_position_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.data = String(this.position);
  item.schemaTypeInfo = Fleur.Type_integer;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["position#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:position", Fleur.Context.prototype.fn_position_0,
  [], Fleur.SequenceType_integer_1);
/*
function(ctx) {
    return ctx._pos;
  },
  null, [], true, false, {type: Fleur.Type_integer});
*/