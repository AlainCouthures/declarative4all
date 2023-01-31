"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_normalize$_space_0 = function() {
  return this.current().fn_normalize$_empty_1();
};

Fleur.Context.prototype.fn_normalize$_space_1 = function() {
  const res = new Fleur.Text();
  if (this.item.isNotEmpty()) {
    res.data = this.item.data.trim().replace(/\s+/g, " ");
  } else {
    res.data = "";
  }
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["normalize-space#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-space", Fleur.Context.prototype.fn_normalize$_space_0,
  [], Fleur.SequenceType_string_1);

Fleur.XPathFunctions_fn["normalize-space#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-space", Fleur.Context.prototype.fn_normalize$_space_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);
/*
  function(ctx) {
    return ctx._curr ? ctx._curr.textContent.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ") : "";
  },
  null, [], true, false, {type: Fleur.Type_string});
*/
/*
  function(arg) {
    return arg ? arg.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ") : "";
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/