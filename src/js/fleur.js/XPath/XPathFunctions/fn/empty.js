"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_empty_1 = function() {
  const isempty = this.item.isEmpty();
  this.item = new Fleur.Text();
  this.item.data = String(isempty);
  this.item.schemaTypeInfo = Fleur.Type_boolean;
  return this;
};

Fleur.XPathFunctions_fn["empty#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:empty", Fleur.Context.prototype.fn_empty_1,
  [Fleur.SequenceType_item_0n], Fleur.SequenceType_boolean_1);
/*
  function(arg) {
    return arg === Fleur.EmptySequence;
  },
  null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_boolean});
*/