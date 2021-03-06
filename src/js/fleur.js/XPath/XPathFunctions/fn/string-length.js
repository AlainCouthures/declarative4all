"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_string$_length_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_integer},
  params_type: [
    {type: Fleur.Type_string, occurence: "?"}
  ]
};
Fleur.Context.prototype.fn_string$_length_1 = function() {
  if (this.item.isNotEmpty()) {
    this.item.data = Fleur.Type_integer.canonicalize(String(this.item.data.length));
  } else {
		this.item = new Fleur.Text();
		this.item.data = "0";
	}
	this.item.schemaTypeInfo = Fleur.Type_integer;
  return this;
};

Fleur.XPathFunctions_fn["string-length#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length",
	function(ctx) {
		if (!ctx._curr) {
			return 0;
		}
		var a = Fleur.Atomize(ctx._curr);
		return a.data.length;
	},
	null, [], true, false, {type: Fleur.Type_integer});

Fleur.XPathFunctions_fn["string-length#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length",
	function(arg) {
		return !arg ? 0 : arg.length;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer});