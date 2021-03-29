/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.prof_sleep_1 = {
  need_ctx: false,
  is_async: true,
  return_type: {type: Fleur.EmptySequence},
  params_type: [
    {type: Fleur.Type_integer}
  ]
};
Fleur.Context.prototype.prof_sleep_1_async = async function() {
  await new Promise(resolve => setTimeout(resolve, Number(this.item.data)));
  this.item = new Fleur.Sequence();
  return this;
};

Fleur.XPathFunctions_prof["sleep#1"] = new Fleur.Function("http://basex.org/modules/proc", "prof:sleep",
	function(ms, callback) {
		if (ms > 0) {
			setTimeout(function() {
				callback(null);
			}, Number(ms));
			return;
		}
		callback(null);
	},
	null, [{type: Fleur.Type_integer}], false, true, {type: Fleur.EmptySequence});