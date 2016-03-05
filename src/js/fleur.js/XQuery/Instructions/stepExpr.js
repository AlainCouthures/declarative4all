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
		if (children[l - 1][0] === Fleur.XQueryX.predicates) {
			l--;
		}
		ctx._stepctx.ignore = false;
		while (i < l) {
			Fleur.XQueryEngine[children[i][0]](ctx, children[i][1]);
			if (ctx._stepctx.ignore || !ctx._stepctx.curr) {
				break;
			}
			if (i === l - 1) {
				if (!ctx._result) {
					ctx._result = ctx._stepctx.curr;
				} else {
					if (ctx._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(ctx._result);
						ctx._result = seq;
					}
					if (ctx._stepctx.curr.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						ctx._result.appendChild(ctx._stepctx.curr);
					} else {
						ctx._stepctx.curr.childNodes.forEach(function(n) {
							ctx._result.appendChild(n);
						});
					}
				}
			}
			i++;
		}
	}
	while (ctx._stepctx.continue);
	if (l !== children.length && ctx._result) {
		Fleur.XQueryEngine[children[l][0]](ctx, children[l][1]);
	}
};