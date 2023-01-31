"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_substring$_after_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  const res = new Fleur.Text();
  if (arg1.isNotEmpty()) {
    if (arg2.isNotEmpty() || arg2.data === "") {
      const index = arg1.data.indexOf(arg2.data);
      res.data = index === -1 ? "" : arg1.data.substring(index + arg2.data.length);
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
Fleur.Context.prototype.fn_substring$_after_3 = function() {
  const collation = this.item;
  const arg2 = this.itemstack.pop();
  const arg1 = this.itemstack.pop();
  const res = new Fleur.Text();
  if (arg1.isNotEmpty()) {
    if (arg2.isNotEmpty() || arg2.data === "") {
      const c = Fleur.getCollation(collation.data);
      res.data = c.substringAfter(arg1.data, arg2.data);
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

Fleur.XPathFunctions_fn["substring-after#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-after", Fleur.Context.prototype.fn_substring$_after_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);

Fleur.XPathFunctions_fn["substring-after#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-after", Fleur.Context.prototype.fn_substring$_after_3,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_string_01, Fleur.SequenceType_string_1], Fleur.SequenceType_string_1);
/*
  function(a, b) {
    if (!a) {
      return "";
    }
    if (!b || b === "") {
      return a;
    }
    var index = a.indexOf(b);
    return index === -1 ? "" : a.substring(index + b.length);
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
    if (!a) {
      return "";
    }
    if (!b || b === "") {
      return a;
    }
    return c.substringAfter(a, b);
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
*/