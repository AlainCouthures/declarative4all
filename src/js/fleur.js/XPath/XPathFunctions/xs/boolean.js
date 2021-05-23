"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_boolean_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_boolean,
  params_type: [
    Fleur.atomicTypes
  ]
};
Fleur.Context.prototype.xs_boolean_1 = function() {
	if (this.item.isNotEmpty()) {
    const schematype = this.item.schemaTypeInfo;
    if (schematype !== Fleur.Type_boolean) {
      if (schematype === Fleur.Type_integer || schematype === Fleur.Type_decimal || schematype === Fleur.Type_float || schematype === Fleur.Type_double) {
        this.item.data = (this.item.data === "0" || this.item.data === "NaN") ? "false" : "true";
      }
      try {
        this.item.data = Fleur.Type_boolean.canonicalize(this.item.textContent);
        this.item.schemaTypeInfo = Fleur.Type_boolean;
      } catch (e) {
        Fleur.XQueryError_xqt(e.code === Fleur.DOMException.VALIDATION_ERR ? "FORG0001" : "FODT0001", null, "Wrong argument type for xs:boolean#1", "", this.item);
      }
    }
  }
  return this;
};

Fleur.XPathFunctions_xs["boolean#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:boolean",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_boolean, function(node) {
			if (node.schemaTypeInfo === Fleur.Type_integer || node.schemaTypeInfo === Fleur.Type_decimal || node.schemaTypeInfo === Fleur.Type_float || node.schemaTypeInfo === Fleur.Type_double) {
				node.data = (node.data === "0" || node.data === "NaN") ? "false" : "true";
			} else {
				node = Fleur.error(ctx, "FORG0001");
			}
		});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
