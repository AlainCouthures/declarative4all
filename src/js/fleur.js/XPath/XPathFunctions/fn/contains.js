"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_contains_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  const res = new Fleur.Text();
  if (arg2.isNotEmpty()) {
    if (arg1.isNotEmpty()) {
      res.data = String(arg1.data.indexOf(arg2.data) !== -1);
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
Fleur.Context.prototype.fn_contains_3 = function() {
  const collation = this.item;
  const arg2 = this.itemstack.pop();
  const arg1 = this.itemstack.pop();
  const res = new Fleur.Text();
  if (arg2.isNotEmpty()) {
    if (arg1.isNotEmpty()) {
      const c = Fleur.getCollation(collation.data);
      res.data = String(c.contains(arg1.data,arg2.data));
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

Fleur.XPathFunctions_fn["contains#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains", Fleur.Context.prototype.fn_contains_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01], Fleur.SequenceType_boolean_01);
Fleur.XPathFunctions_fn["contains#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains", Fleur.Context.prototype.fn_contains_3,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01, Fleur.SequenceType_string_1], Fleur.SequenceType_boolean_01);
/*
function(a, b) {
    return !b ? true : !a ? false : a.indexOf(b) !== -1;
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
    return !b ? true : !a ? false : c.contains(a, b);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
*/