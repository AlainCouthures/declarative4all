/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.pathExpr] = function(ctx, children) {
	var i, l, curr, prevstep, result;
	ctx._result = [];
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	if (children.length > 1) {
		curr = ctx._curr;
		l = ctx._result.length;
		i = 0;
		prevstep = ctx._result.slice(0);
		result = ctx._result = [];
		while (i < l) {
			ctx._curr = prevstep[i];
			Fleur.XQueryEngine[Fleur.XQueryX.pathExpr](ctx, children.slice(1));
			result = result.concat(ctx._result);
			i++;
		}
		ctx._result = result;
		ctx._curr = curr;
	}
};