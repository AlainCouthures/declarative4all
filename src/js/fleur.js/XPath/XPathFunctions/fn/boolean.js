"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_boolean_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_boolean},
  params_type: [
    Fleur.Node
  ]
};
Fleur.Context.prototype.fn_boolean_1 = function() {
	const newitem = new Fleur.Text();
	newitem.schemaTypeInfo = Fleur.Type_boolean;
  if (this.item.isEmpty()) {
    newitem.appendData("false");
    this.item = newitem;
    return this;
  }
  if (this.item.nodeType === Fleur.Node.SEQUENCE_NODE) {
    if (this.item.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || this.item.childNodes[0].ownerDocument) {
      newitem.appendData("true");
      this.item = newitem;
      return this;
    }
    this.item = Fleur.error(this.ctx, "FORG00006");
    return this;
  }
  if (this.item.nodeType !== Fleur.Node.TEXT_NODE) {
    newitem.appendData("true");
    this.item = newitem;
    return this;
  }
  const schematype = this.item.schemaTypeInfo;
  if (schematype === Fleur.Type_boolean) {
    newitem.appendData(String(this.item.data === "true"));
  } else if (schematype === Fleur.Type_string || schematype === Fleur.Type_untypedAtomic || schematype === Fleur.Type_anyURI) {
    newitem.appendData(String(this.item.hasOwnProperty("data") && this.item.data.length !== 0));
  } else if (schematype === Fleur.Type_integer || schematype === Fleur.Type_decimal || schematype === Fleur.Type_float || schematype === Fleur.Type_double) {
    newitem.appendData(String(this.item.data !== "0" && this.item.data !== "0.0" && this.item.data !== "0.0e0" && this.item.data !== "NaN"));
  } else if (schematype && schematype.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
    newitem.appendData(String(this.item.data === "true"));
  } else if (schematype && (schematype.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || schematype.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION) || schematype.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
    newitem.appendData(String(this.item.hasOwnProperty("data") && this.item.data.length !== 0));
  } else if (schematype && (schematype.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || schematype.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || schematype.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || schematype.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
    newitem.appendData(String(this.item.data !== "0" && this.item.data !== "0.0" && this.item.data !== "0.0e0" && this.item.data !== "NaN"));
  } else {
    this.item = Fleur.error(this.ctx, "FORG00006");
    return this;
  }
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["boolean#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:boolean",
	function(arg) {
		var e;
		if (arg === Fleur.EmptySequence) {
			return false;
		}
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (arg.childNodes.length === 0) {
				return false;
			}
			if (arg.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || arg.childNodes[0].ownerDocument) {
				return true;
			}
			e = new Error("The supplied sequence contains values inappropriate to fn:boolean");
			e.name = "FORG0006";
			return e;
		}
		if (arg.nodeType !== Fleur.Node.TEXT_NODE) {
			return true;
		}
		if (arg.schemaTypeInfo === Fleur.Type_boolean) {
			return arg.data === "true";
		}
		if (arg.schemaTypeInfo === Fleur.Type_string || arg.schemaTypeInfo === Fleur.Type_untypedAtomic || arg.schemaTypeInfo === Fleur.Type_anyURI) {
			return arg.hasOwnProperty("data") && arg.data.length !== 0;
		}
		if (arg.schemaTypeInfo === Fleur.Type_integer || arg.schemaTypeInfo === Fleur.Type_decimal || arg.schemaTypeInfo === Fleur.Type_float || arg.schemaTypeInfo === Fleur.Type_double) {
			return arg.data !== "0" && arg.data !== "0.0" && arg.data !== "0.0e0" && arg.data !== "NaN";
		}
		if (arg.schemaTypeInfo && arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return arg.data === "true";
		}
		if (arg.schemaTypeInfo && (arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
			return arg.hasOwnProperty("data") && arg.data.length !== 0;
		}
		if (arg.schemaTypeInfo && (arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
			return arg.data !== "0" && arg.data !== "0.0" && arg.data !== "0.0e0" && arg.data !== "NaN";
		}
		e = new Error("The supplied sequence contains values inappropriate to fn:boolean");
		e.name = "FORG0006";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Type_boolean});