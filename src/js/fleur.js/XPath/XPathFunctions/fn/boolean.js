/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["boolean#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:boolean",
	function(arg, ctx) {
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
		if (arg.schemaTypeInfo === Fleur.Type_boolean) {
			return arg.data === "true";
		}
		if (arg.schemaTypeInfo === Fleur.Type_string || arg.schemaTypeInfo === Fleur.Type_untypedAtomic || arg.schemaTypeInfo === Fleur.Type_anyURI) {
			return arg.hasOwnProperty("data") && arg.data.length !== 0;
		}
		if (arg.schemaTypeInfo === Fleur.Type_integer || arg.schemaTypeInfo === Fleur.Type_decimal || arg.schemaTypeInfo === Fleur.Type_float || arg.schemaTypeInfo === Fleur.Type_double) {
			return arg.data !== "0" && arg.data !== "0.0" && arg.data !== "0.0e0" && arg.data !== "NaN";
		}
		if (arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return arg.data === "true";
		}
		if (arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return arg.hasOwnProperty("data") && arg.data.length !== 0;
		}
		if (arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return arg.data !== "0" && arg.data !== "0.0" && arg.data !== "0.0e0" && arg.data !== "NaN";
		}
		e = new Error("The supplied sequence contains values inappropriate to fn:boolean");
		e.name = "FORG0006";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Type_boolean});