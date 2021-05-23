"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_dateTimeStamp_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_dateTimeStamp,
  params_type: [
    Fleur.atomicTypes
  ]
};
Fleur.Context.prototype.xs_dateTimeStamp_1 = function() {
	this.typeConstructor(Fleur.Type_dateTimeStamp);
	return this;
};

Fleur.XPathFunctions_xs["dateTimeStamp#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:dateTimeStamp",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_dateTimeStamp, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});