"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_substring_2 = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  const res = new Fleur.Text();
  if (arg1.isNotEmpty()) {
    res.data = arg1.data.substr(Number(arg2.data) - 1);
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};
Fleur.Context.prototype.fn_substring_3 = function() {
  const arg3 = this.item;
  const arg2 = this.itemstack.pop();
  const arg1 = this.itemstack.pop();
  const res = new Fleur.Text();
  if (arg1.isNotEmpty()) {
    res.data = arg1.data.substr(Number(arg2.data) - 1, Number(arg3.data));
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["substring#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring", Fleur.Context.prototype.fn_substring_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_numeric_1], Fleur.SequenceType_string_1);

Fleur.XPathFunctions_fn["substring#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring", Fleur.Context.prototype.fn_substring_3,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_numeric_1, Fleur.SequenceType_numeric_1], Fleur.SequenceType_string_1);
/*
  function(source, start) {
    return source ? source.substr(Number(start) - 1) : "";
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});
*/
/*
  function(source, start, end) {
    return source ? source.substr(Number(start) - 1, Number(end)) : "";
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_integer}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});
*/