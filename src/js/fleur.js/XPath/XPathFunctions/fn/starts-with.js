"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_starts$_with_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  const res = new Fleur.Text();
  if (arg2.isNotEmpty()) {
    if (arg1.isNotEmpty()) {
      res.data = String(arg1.data.startsWith(arg2.data));
    } else {
      res.data = String(arg2.data.length === 0);
    }
  } else {
    res.data = "true";
  }
  res.schemaTypeInfo = Fleur.Type_boolean;
  this.item = res;
  return this;
};
Fleur.Context.prototype.fn_starts$_with_3 = function() {
  this.notyet();
};

Fleur.XPathFunctions_fn["starts-with#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:starts-with",
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01], Fleur.SequenceType_boolean_1);

Fleur.XPathFunctions_fn["starts-with#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:starts-with",
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01, Fleur.SequenceType_string_1], Fleur.SequenceType_boolean_1);
/*
  function(a, b) {
    return !b ? true : !a ? false : a.startsWith(b);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
*/
/*
  function(a, b, collation) {
    var c = Fleur.getCollation(collation);
    if (!c) {
      var e = new Error("");
      e.name = "FOCH0002";
      return e;
    }
    return !b ? true : !a ? false : c.startsWith(a, b);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
*/