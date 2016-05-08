/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.greaterThanOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) > 0 :
			op1.schemaTypeInfo === Fleur.Type_boolean ? (op1.data === "true") > (op2.data === "true") :
			parseFloat(op1.data) > parseFloat(op2.data);
	}, callback);
};