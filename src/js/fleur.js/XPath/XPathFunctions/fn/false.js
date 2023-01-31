"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_false_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData("false");
  item.schemaTypeInfo = Fleur.Type_boolean;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["false#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:false", Fleur.Context.prototype.fn_false_0,
  [], Fleur.SequenceType_boolean_1);
/*
  function() {
    return false;
  },
  null, [], false, false, {type: Fleur.Type_boolean});
*/