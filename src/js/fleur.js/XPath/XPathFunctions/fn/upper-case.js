"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_upper$_case_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_string},
  params_type: [
    {type: Fleur.Type_string, occurence: "?"}
  ]
};
Fleur.Context.prototype.fn_upper$_case_1 = function() {
  if (this.item.isNotEmpty()) {
    this.item.data = this.item.data.toUpperCase();
  } else {
		this.item = new Fleur.Text();
		this.item.data = "";
	}
	this.item.schemaTypeInfo = Fleur.Type_string;
  return this;
};

Fleur.XPathFunctions_fn["upper-case#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:upper-case",
	function(arg) {
		return arg ? arg.toUpperCase() : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});