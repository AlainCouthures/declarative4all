/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_string_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_string,
  params_type: [
    Fleur.Node
  ]
};
Fleur.Context.prototype.xs_string_1 = function() {
	if (this.item.isNotEmpty()) {
    this.item = Fleur.Atomize(this.item);
    const schematype = this.item.schemaTypeInfo;
    if (schematype !== Fleur.Type_error && schematype !== Fleur.Type_string) {
      if (schematype === Fleur.Type_string || schematype === Fleur.Type_untypedAtomic) {
        if (!this.item.hasOwnProperty("data")) {
          this.item = Fleur.error(this.ctx, "FORG0001");
          return this;
        }
      }
      this.item.schemaTypeInfo = Fleur.Type_string;
      try {
        this.item.data = this.item.schemaTypeInfo.canonicalize(this.item.data);
      } catch (e) {
        this.item = Fleur.error(this.ctx, e.code === Fleur.DOMException.VALIDATION_ERR ? "FORG0001" : "FODT0001");
      }
    }
  }
  return this;
};

Fleur.XPathFunctions_xs["string#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:string",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_string, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});