"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_unsignedShort_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_unsignedShort,
  params_type: [
    Fleur.atomicTypes
  ]
};
Fleur.Context.prototype.xs_unsignedShort_1 = function() {
	this.typeConstructor(Fleur.Type_unsignedShort);
	return this;
};

Fleur.XPathFunctions_xs["unsignedShort#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:unsignedShort",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_unsignedShort, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});