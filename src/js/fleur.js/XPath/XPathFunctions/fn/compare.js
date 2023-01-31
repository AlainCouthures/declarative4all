"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_compare_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  if (arg1.isEmpty()) {
    this.item = arg1;
  } else if (!arg2.isEmpty()) {
    const res = new Fleur.Text();
    res.schemaTypeInfo = Fleur.Type_integer;
    res.data = arg1.data === arg2.data ? "0" : arg1.data < arg2.data ? "-1" : "1";
    this.item = res;
  }
  return this;
};
Fleur.Context.prototype.fn_compare_3 = function() {
  const collation = this.item;
  const arg2 = this.itemstack.pop();
  const arg1 = this.itemstack.pop();
  if (arg1.isEmpty()) {
    this.item = arg1;
  } else if (!arg2.isEmpty()) {
    const res = new Fleur.Text();
    res.schemaTypeInfo = Fleur.Type_integer;
    const c = Fleur.getCollation(collation.data);
    res.data = c.equals(arg1.data, arg2.data) ? "0" : c.lessThan(arg1.data, arg2.data) ? "-1" : "1";
    this.item = res;
  }
  return this;
};

Fleur.XPathFunctions_fn["compare#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:compare", Fleur.Context.prototype.fn_compare_2,
[Fleur.SequenceType_string_01, Fleur.SequenceType_string_01], Fleur.SequenceType_integer_01);

Fleur.XPathFunctions_fn["compare#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:compare", Fleur.Context.prototype.fn_compare_3,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01, Fleur.SequenceType_collation_1], Fleur.SequenceType_integer_01);
/*

  function(comparand1, comparand2) {
    return comparand1 === null || comparand2 === null ? null : comparand1 === comparand2 ? 0 : comparand1 < comparand2 ? -1 : 1;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});
*/
/*
  function(comparand1, comparand2, collation) {
    var c = Fleur.getCollation(collation);
    if (!c) {
      var e = new Error("");
      e.name = "FOCH0002";
      return e;
    }
    return comparand1 === null || comparand2 === null ? null : c.equals(comparand1, comparand2) ? 0 : c.lessThan(comparand1, comparand2) ? -1 : 1;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_integer, occurence: "?"});
*/