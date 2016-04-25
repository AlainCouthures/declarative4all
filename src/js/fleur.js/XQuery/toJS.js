/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.toJSNumber = function(a) {
	if (a.nodeType === Fleur.Node.TEXT_NODE) {
		if (a.schemaTypeInfo === Fleur.Type_integer) {
			return [0, parseInt(a.data, 10)];
		} else if (a.schemaTypeInfo === Fleur.Type_decimal) {
			return [1, parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_float) {
			return [2, parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_double || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			return [3, parseFloat(a.data)];
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [0, parseInt(a.data, 10)];
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [1, parseFloat(a.data)];
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [2, parseFloat(a.data)];
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [3, parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_error) {
			return [-1];
		}
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		return [-1];
	} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0005");
		return [-1];
	}
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSString = function(a) {
	if (a === Fleur.EmptySequence) {
		return [0];
	}
	if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, a.data];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data];
	}
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSBoolean = function(a) {
	var value;
	if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		return [0, a.childNodes.length !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_boolean) {
		return [0, a.data === "true"];
	} else if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, a.data.length !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_integer) {
		value = parseInt(a.data, 10);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
		value = parseFloat(a.data);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data === "true"];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data.length !== 0];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = parseInt(a.data, 10);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = parseFloat(a.data);
		return [0, !isNaN(value) && value !== 0];
	}
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};