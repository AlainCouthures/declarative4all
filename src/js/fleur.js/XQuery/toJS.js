/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.toJSNumber = function(ctx) {
	if (ctx._result.nodeType === Fleur.Node.TEXT_NODE) {
		if (ctx._result.schemaTypeInfo === Fleur.Type_integer) {
			return [0, parseInt(ctx._result.data, 10)];
		} else if (ctx._result.schemaTypeInfo === Fleur.Type_decimal) {
			return [1, parseFloat(ctx._result.data)];
		} else if (ctx._result.schemaTypeInfo === Fleur.Type_float) {
			return [2, parseFloat(ctx._result.data)];
		} else if (ctx._result.schemaTypeInfo === Fleur.Type_double) {
			return [3, parseFloat(ctx._result.data)];
		} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [0, parseInt(ctx._result.data, 10)];
		} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [1, parseFloat(ctx._result.data)];
		} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [2, parseFloat(ctx._result.data)];
		} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [3, parseFloat(ctx._result.data)];
		} else if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
			return [-1];
		}
		Fleur.error(ctx, "XPTY0004");
		return [-1];
	} else if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
		Fleur.error(ctx, "XPST0005");
		return [-1];
	}
	Fleur.error(ctx, "XPTY0004");
	return [-1];
};
Fleur.toJSString = function(ctx) {
	if (ctx._result.schemaTypeInfo === Fleur.Type_string || ctx._result.schemaTypeInfo === Fleur.Type_anyURI || ctx._result.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, ctx._result.data];
	} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, ctx._result.data];
	}
	ctx._result = new Fleur.Text();
	ctx._result.schemaTypeInfo = Fleur.Type_error;
	ctx._result.data = "XPTY0004";
	return [-1];
};
Fleur.toJSBoolean = function(ctx) {
	var value;
	if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
		return [0, ctx._result.childNodes.length !== 0];
	} else if (ctx._result.schemaTypeInfo === Fleur.Type_boolean) {
		return [0, ctx._result.data === "true"];
	} else if (ctx._result.schemaTypeInfo === Fleur.Type_string || ctx._result.schemaTypeInfo === Fleur.Type_anyURI || ctx._result.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, ctx._result.data.length !== 0];
	} else if (ctx._result.schemaTypeInfo === Fleur.Type_integer) {
		value = parseInt(ctx._result.data, 10);
		return [0, !isNaN(value) && value !== 0];
	} else if (ctx._result.schemaTypeInfo === Fleur.Type_decimal || ctx._result.schemaTypeInfo === Fleur.Type_float || ctx._result.schemaTypeInfo === Fleur.Type_double) {
		value = parseFloat(ctx._result.data);
		return [0, !isNaN(value) && value !== 0];
	} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, ctx._result.data === "true"];
	} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, ctx._result.data.length !== 0];
	} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = parseInt(ctx._result.data, 10);
		return [0, !isNaN(value) && value !== 0];
	} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = parseFloat(ctx._result.data);
		return [0, !isNaN(value) && value !== 0];
	}
	ctx._result = new Fleur.Text();
	ctx._result.schemaTypeInfo = Fleur.Type_error;
	ctx._result.data = "XPTY0004";
	return [-1];
};