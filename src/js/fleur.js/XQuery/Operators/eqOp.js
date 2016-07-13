/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.eqOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, function(op1, op2) {
		if (op1.schemaTypeInfo === Fleur.Type_string && op2.schemaTypeInfo === Fleur.Type_string) {
			return op1.data.localeCompare(op2.data) === 0;
		}
		if (Fleur.numericTypes.indexOf(op1.schemaTypeInfo) !== -1 && Fleur.numericTypes.indexOf(op2.schemaTypeInfo) !== -1) {
			var v1, v2;
			if (op1.schemaTypeInfo === Fleur.Type_integer) {
				v1 = parseInt(op1.data, 10);
			} else if (op1.schemaTypeInfo === Fleur.Type_decimal) {
				v1 = parseFloat(op1.data);
			} else if (op1.schemaTypeInfo === Fleur.Type_float || op1.schemaTypeInfo === Fleur.Type_double) {
				if (op1.data === "INF" || op1.data === "-INF" || op1.data === "NaN") {
					v1 = op1.data;
				} else {
					v1 = parseFloat(op1.data);
				}
			} else if (op1.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				v1 = parseInt(op1.data, 10);
			} else if (op1.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				v1 = parseFloat(op1.data);
			} else if (op1.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || op1.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				if (op1.data === "INF" || op1.data === "-INF" || op1.data === "NaN") {
					v1 = op1.data;
				} else {
					v1 = parseFloat(op1.data);
				}
			}
			if (op2.schemaTypeInfo === Fleur.Type_integer) {
				v2 = parseInt(op2.data, 10);
			} else if (op2.schemaTypeInfo === Fleur.Type_decimal) {
				v2 = parseFloat(op2.data);
			} else if (op2.schemaTypeInfo === Fleur.Type_float || op2.schemaTypeInfo === Fleur.Type_double) {
				if (op2.data === "INF" || op2.data === "-INF" || op2.data === "NaN") {
					v2 = op2.data;
				} else {
					v2 = parseFloat(op2.data);
				}
			} else if (op2.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				v2 = parseInt(op2.data, 10);
			} else if (op2.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				v2 = parseFloat(op2.data);
			} else if (op2.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || op2.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				if (op2.data === "INF" || op2.data === "-INF" || op2.data === "NaN") {
					v2 = op2.data;
				} else {
					v2 = parseFloat(op2.data);
				}
			}
			return v1 !== "NaN" && v2 !== "NaN" && v1 === v2;
		}
		return op1.schemaTypeInfo === op2.schemaTypeInfo && op1.data === op2.data;
	}, callback);
};