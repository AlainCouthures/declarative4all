"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_upper$_case_1 = function() {
  const res = new Fleur.Text();
  if (this.item.isNotEmpty()) {
    res.data = this.item.data.toUpperCase();
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["upper-case#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:upper-case", Fleur.Context.prototype.fn_upper$_case_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);
/*
  function(arg) {
    return arg ? arg.toUpperCase() : "";
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/