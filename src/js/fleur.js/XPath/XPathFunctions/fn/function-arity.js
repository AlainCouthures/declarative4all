"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_function$_arity_1 = function() {
  const newitem = new Fleur.Text();
  newitem.data = String(this.item.argtypes.length);
  newitem.schemaTypeInfo = Fleur.Type_integer;
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["function-arity#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-arity", Fleur.Context.prototype.fn_function$_arity_1,
  [Fleur.SequenceType_function_1], Fleur.SequenceType_integer_1);
/*
  function(f) {
    return f.argtypes.length;
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Type_integer});
*/