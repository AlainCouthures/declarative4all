/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.stepExpr] = function(ctx, children) {
	var i, l;
	ctx._stepctx = {};
	do {
		i = 0;
		l = children.length;
		ctx._stepctx.ignore = false;
		while (i < l) {
			Fleur.XQueryEngine[children[i][0]](ctx, children[i][1]);
			if (ctx._stepctx.ignore || !ctx._stepctx.curr) {
				break;
			}
			if (i === l - 1) {
				ctx._result.push(ctx._stepctx.curr);
			}
			i++;
		}
	}
	while (ctx._stepctx.continue);
};