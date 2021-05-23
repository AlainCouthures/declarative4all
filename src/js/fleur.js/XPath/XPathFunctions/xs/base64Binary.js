"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_base64Binary_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_base64Binary,
  params_type: [
    Fleur.atomicTypes
  ]
};
Fleur.Context.prototype.xs_base64Binary_1 = function() {
	this.typeConstructor(Fleur.Type_base64Binary);
	return this;
};

Fleur.XPathFunctions_xs["base64Binary#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:base64Binary",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_base64Binary, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});