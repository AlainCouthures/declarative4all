"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_base_$uri_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_boolean},
  params_type: [
    Fleur.Node
  ]
};
Fleur.Context.prototype.fn_base_$uri_1 = function() {
};

Fleur.XPathFunctions_fn["base-uri#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:base-uri",
	function(ctx) {
		return Fleur.XPathFunctions_fn["base-uri#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Type_anyURI});

Fleur.XPathFunctions_fn["base-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:base-uri",
	function(node) {
		if (node === Fleur.EmptySequence) {
			return null;
		}
		if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
			var e = new Error("");
			e.name = "XPTY0004";
			return e;
		}
		return "";
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_anyURI});