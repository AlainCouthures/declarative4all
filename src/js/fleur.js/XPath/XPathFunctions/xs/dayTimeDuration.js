"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_dayTimeDuration_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_dayTimeDuration,
  params_type: [
    Fleur.atomicTypes
  ]
};
Fleur.Context.prototype.xs_dayTimeDuration_1 = function() {
	this.typeConstructor(Fleur.Type_dayTimeDuration);
	return this;
};

Fleur.XPathFunctions_xs["dayTimeDuration#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:dayTimeDuration",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_dayTimeDuration, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});