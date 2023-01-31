"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_exists_1 = function() {
  const previtem = this.item;
  this.item = new Fleur.Text();
  this.item.data = String(previtem.isNotEmpty());
  this.item.schemaTypeInfo = Fleur.Type_boolean;
  return this;
};

Fleur.XPathFunctions_fn["exists#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:exists", Fleur.Context.prototype.fn_exists_1,
  [Fleur.SequenceType_item_0n], Fleur.SequenceType_boolean_1);
/*
  function(arg) {
    return arg !== Fleur.EmptySequence;
  },
  null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_boolean});
*/