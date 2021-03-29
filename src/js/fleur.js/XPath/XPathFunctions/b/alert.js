/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.b_alert_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.EmptySequence,
  params_type: [
    Fleur.Type_string
  ]
};
Fleur.Context.prototype.b_alert_1 = function() {
  alert(this.item.data);
  this.item = new Fleur.Sequence();
  return this;
};

Fleur.XPathFunctions_b["alert#1"] = new Fleur.Function("http://xqib.org", "b:alert",
	function(s) {
		alert(s);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.EmptySequence});