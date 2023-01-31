"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_codepoint$_equal_2 = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  if (arg1.isEmpty()) {
    this.item = arg1;
    return this;
  }
  if (arg2.isEmpty()) {
    return this;
  }
  const newitem = new Fleur.Text();
  newitem.schemaTypeInfo = Fleur.Type_boolean;
  newitem.appendData(String(arg1.data === arg2.data));
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["codepoint-equal#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:codepoint-equal", Fleur.Context.prototype.fn_codepoint$_equal_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01], Fleur.SequenceType_boolean_01);
/*
  function(comparand1, comparand2) {
    return comparand1 === null || comparand2 === null ? null : comparand1 === comparand2;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean, occurence: "?"});
*/