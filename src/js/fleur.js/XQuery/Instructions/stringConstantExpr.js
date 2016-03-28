/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.stringConstantExpr] = function(ctx, children) {
	ctx._result = new Fleur.Text();
	ctx._result.appendData(children[0][1][0] || "");
	ctx._result.schemaTypeInfo = Fleur.Type_string;
};