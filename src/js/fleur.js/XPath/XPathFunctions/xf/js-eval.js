"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xf_js$_eval_1 = function() {
  const res = new Fleur.Text();
  res.data = String((0, eval)(this.item.data));
  res.schemaTypeInfo = Fleur.Type_string;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_xf["js-eval#1"] = new Fleur.Function("http://www.w3.org/2002/xforms", "xf:js-eval", Fleur.Context.prototype.xf_js$_eval_1,
  [Fleur.SequenceType_string_01], Fleur.SequenceType_string_0n, {dynonly: true});