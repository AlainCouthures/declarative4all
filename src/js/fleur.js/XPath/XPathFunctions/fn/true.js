"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_true_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData("true");
  item.schemaTypeInfo = Fleur.Type_boolean;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["true#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:true", Fleur.Context.prototype.fn_true_0,
  [], Fleur.SequenceType_boolean_1);
/*
  function() {
    return true;
  },
  null, [], false, false, {type: Fleur.Type_boolean});
*/