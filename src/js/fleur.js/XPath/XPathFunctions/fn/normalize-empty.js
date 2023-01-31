"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_normalize$_empty_0 = function() {
  return this.current().fn_normalize$_empty_1();
};
Fleur.Context.prototype.fn_normalize$_empty_1 = function() {
  if (this.item.isEmpty()) {
    this.item = new Fleur.Text("");
  }
  return this;
};

Fleur.XPathFunctions_fn["normalize-empty#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-empty", Fleur.Context.prototype.fn_normalize$_empty_0,
  [], Fleur.SequenceType_string_1);

Fleur.XPathFunctions_fn["normalize-empty#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-empty", Fleur.Context.prototype.fn_normalize$_empty_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_string_1);
/*
  function(ctx) {
    return ctx._curr && ctx._curr.textContent !== "" ? ctx._curr.textContent : null;
  },
  null, [], true, false, {type: Fleur.Type_string});
*/
/*
  function(arg) {
    return arg && arg !== "" ? arg : null;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
*/