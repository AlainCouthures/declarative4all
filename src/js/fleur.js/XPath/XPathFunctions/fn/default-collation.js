"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_default$_collation_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData("http://www.w3.org/2005/xpath-functions/collation/codepoint");
  item.schemaTypeInfo = Fleur.Type_collation;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["default-collation#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:default-collation", Fleur.Context.prototype.fn_default$_collation_0,
  [], Fleur.SequenceType_string_1);
/*
  function() {
    return "http://www.w3.org/2005/xpath-functions/collation/codepoint";
  },
  null, [], false, false, {type: Fleur.Type_string});
*/