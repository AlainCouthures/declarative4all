/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["boolean"] = function(ctx, children) {
	if (children.length !== 1) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	var boolean;
	if (ctx._result.schemaTypeInfo === Fleur.Type_boolean) {
		boolean = ctx._result.data;
	} else if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
		boolean = ctx._result.childNodes.length === 0 ? "false" : "true";
	} else if (ctx._result.schemaTypeInfo === Fleur.Type_string || ctx._result.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		boolean = (!ctx._result.data || !ctx._result.data.length === 0) ? "false" : "true";
	} else if (ctx._result.schemaTypeInfo === Fleur.Type_integer || ctx._result.schemaTypeInfo === Fleur.Type_decimal || ctx._result.schemaTypeInfo === Fleur.Type_float || ctx._result.schemaTypeInfo === Fleur.Type_double) {
		boolean = (ctx._result.data === "0" || ctx._result.data === "NaN") ? "false" : "true";
	} else {
		Fleur.error(ctx, "FORG0006");
		return;
	}
	ctx._result = new Fleur.Text();
	ctx._result.data = boolean;
	ctx._result.schemaTypeInfo = Fleur.Type_boolean;
};