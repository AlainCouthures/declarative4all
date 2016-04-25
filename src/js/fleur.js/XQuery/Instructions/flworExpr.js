/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.flworExpr] = function(ctx, children, callback) {
	var i = 0, l;
	l = children.length;
	while (i < l) {
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1]);
		if (ctx._result && ctx._result.schemaTypeInfo === Fleur.Type_error) {
			return;
		}
		i++;
	}
};