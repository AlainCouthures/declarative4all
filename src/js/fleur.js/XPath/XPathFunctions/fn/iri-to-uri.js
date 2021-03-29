"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
 Fleur.signatures.fn_iri$_to$_uri_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_string},
  params_type: [
    {type: Fleur.Type_string, occurence: "?"}
  ]
};
Fleur.Context.prototype.fn_iri$_to$_uri_1 = function() {
  if (this.item.isNotEmpty()) {
    this.item.data = this.item.data.replace(/([^!-~]|[<>"{}|\\\^\`])/g, function(c) {
			return encodeURIComponent(c);
		});
  } else {
		this.item = new Fleur.Text();
		this.item.data = "";
	}
	this.item.schemaTypeInfo = Fleur.Type_string;
  return this;
};

Fleur.XPathFunctions_fn["iri-to-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:iri-to-uri",
	function(iri) {
		return iri !== null ? iri.replace(/([^!-~]|[<>"{}|\\\^\`])/g, function(c) {return encodeURIComponent(c);}) : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});