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
		return op1.schemaTypeInfo === Fleur.Type_string && op2.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) === 0 :
			op1.schemaTypeInfo === op2.schemaTypeInfo && op1.data === op2.data;
	}, callback);
};