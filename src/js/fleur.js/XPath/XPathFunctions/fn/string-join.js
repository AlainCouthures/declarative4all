"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_string$_join_1 = function() {
  return this.xqx_stringConstantExpr("").fn_string$_join_2();
};
Fleur.Context.prototype.fn_string$_join_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  this.item = new Fleur.Text("");
  this.item.schemaTypeInfo = Fleur.Type_string;
  if (arg1.isNotEmpty()) {
    if (arg1.nodeType !== Fleur.Node.SEQUENCE_NODE) {
      this.item.data = arg1.data;
    } else {
      const l = arg1.childNodes.length;
      const sep = arg2.isEmpty() ? "" : arg2.data;
      this.item.data = arg1.childNodes[0].data;
      for (let i = 1; i < l; i++) {
        this.item.data += sep + arg1.childNodes[i].data;
      }
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["string-join#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-join", Fleur.Context.prototype.fn_string$_join_1,
  [Fleur.SequenceType_string_0n], Fleur.SequenceType_string_1);

Fleur.XPathFunctions_fn["string-join#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-join", Fleur.Context.prototype.fn_string$_join_2,
  [Fleur.SequenceType_string_0n, Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);
/*
  function(arg1) {
    return Fleur.XPathFunctions_fn["string-join#2"].jsfunc(arg1, "");
  },
  null, [{type: Fleur.Type_string, occurence: "*"}], false, false, {type: Fleur.Type_string});
*/
/*
  function(arg1, arg2) {
    return arg1 instanceof Array ? arg1.join(arg2 || "") : arg1;
  },
  null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/