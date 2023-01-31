"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_string_0 = function() {
  return this.current().fn_string_1();
};
Fleur.Context.prototype.fn_string_1 = function() {
  const newitem = new Fleur.Text(this.item.data);
  newitem.schemaTypeInfo = Fleur.Type_string;
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["string#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string", Fleur.Context.prototype.fn_string_0,
  [], Fleur.SequenceType_string_1);

Fleur.XPathFunctions_fn["string#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string", Fleur.Context.prototype.fn_string_1,
  [Fleur.SequenceType_item_01], Fleur.SequenceType_string_1);
/*
  function(ctx) {
    return Fleur.XPathFunctions_fn["string#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Type_string});
*/
/*
  function(arg) {
    if (arg === Fleur.EmptySequence) {
      return "";
    }
    var a = Fleur.Atomize(arg);
    return a.data;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/