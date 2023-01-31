"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_substring$_before_2 = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  const res = new Fleur.Text();
  if (arg1.isNotEmpty() && arg2.isNotEmpty()) {
    res.data = arg1.data.substring(0, arg1.data.indexOf(arg2.data));
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};
Fleur.Context.prototype.fn_substring$_before_3 = function() {
  const collation = this.item;
  const arg2 = this.itemstack.pop();
  const arg1 = this.itemstack.pop();
  const res = new Fleur.Text();
  if (arg1.isNotEmpty()) {
    if (arg2.isNotEmpty() || arg2.data === "") {
      const c = Fleur.getCollation(collation.data);
      res.data = c.substringBefore(arg1.data, arg2.data);
    } else {
      res.data = arg1.data;
    }
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["substring-before#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-before", Fleur.Context.prototype.fn_substring$_before_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);

Fleur.XPathFunctions_fn["substring-before#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-before", Fleur.Context.prototype.fn_substring$_before_3,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01, Fleur.SequenceType_string_1], Fleur.SequenceType_string_1);
/*
  function(a, b) {
    return !a || !b ? "" : a.substring(0, a.indexOf(b));
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "?"});
*/
/*
  function(a, b, collation) {
    var c = Fleur.getCollation(collation);
    if (!c) {
      var e = new Error("");
      e.name = "FOCH0002";
      return e;
    }
    return !a || !b ? "" : c.substringBefore(a, b);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
*/