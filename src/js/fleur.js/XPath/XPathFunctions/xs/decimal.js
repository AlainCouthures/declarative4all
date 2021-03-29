/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_decimal_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_decimal,
  params_type: [
    Fleur.Node
  ]
};
Fleur.Context.prototype.xs_decimal_1 = function() {
	if (this.item.isNotEmpty()) {
    const schematype = this.item.schemaTypeInfo;
    if (schematype !== Fleur.Type_error && schematype !== Fleur.Type_decimal) {
      if (schematype === Fleur.Type_string || schematype === Fleur.Type_untypedAtomic) {
        if (!this.item.hasOwnProperty("data")) {
          this.item = Fleur.error(this.ctx, "FORG0001");
          return this;
        }
      }
      this.item.schemaTypeInfo = Fleur.Type_decimal;
      try {
        this.item.data = this.item.schemaTypeInfo.canonicalize(this.item.data);
      } catch (e) {
        this.item = Fleur.error(this.ctx, e.code === Fleur.DOMException.VALIDATION_ERR ? "FORG0001" : "FODT0001");
      }
    }
  }
  return this;
};

Fleur.XPathFunctions_xs["decimal#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:decimal",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_decimal, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});