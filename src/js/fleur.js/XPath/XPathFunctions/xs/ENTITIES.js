"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_ENTITIES_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_ENTITIES,
  params_type: [
    Fleur.atomicTypes
  ]
};
Fleur.Context.prototype.xs_ENTITIES_1 = function() {
	this.typeConstructor(Fleur.Type_ENTITIES);
	return this;
};

Fleur.XPathFunctions_xs["ENTITIES#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:ENTITIES",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_ENTITIES, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});