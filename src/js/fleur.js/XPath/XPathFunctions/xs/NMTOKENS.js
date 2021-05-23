"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_NMTOKENS_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_NMTOKENS,
  params_type: [
    Fleur.atomicTypes
  ]
};
Fleur.Context.prototype.xs_NMTOKENS_1 = function() {
	this.typeConstructor(Fleur.Type_NMTOKENS);
	return this;
};

Fleur.XPathFunctions_xs["NMTOKENS#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:NMTOKENS",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_NMTOKENS, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});