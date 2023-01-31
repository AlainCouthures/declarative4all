"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_default$_language_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData("en");
  item.schemaTypeInfo = Fleur.Type_language;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["default-language#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:default-language", Fleur.Context.prototype.fn_default$_language_0,
  [], Fleur.SequenceType_language_1);