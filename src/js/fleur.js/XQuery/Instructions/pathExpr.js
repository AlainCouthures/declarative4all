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
	var i, l, curr, prevstep, result, seq;
	ctx._result = null;
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	if (ctx._result && children.length > 1) {
		curr = ctx._curr;
		if (ctx._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			ctx._curr = ctx._result;
			ctx._result = null;
			Fleur.XQueryEngine[Fleur.XQueryX.pathExpr](ctx, children.slice(1));
			result = ctx._result;
		} else {
			l = ctx._result.childNodes.length;
			i = 0;
			prevstep = ctx._result.childNodes.slice(0);
			result = ctx._result = null;
			while (i < l) {
				ctx._curr = prevstep[i];
				Fleur.XQueryEngine[Fleur.XQueryX.pathExpr](ctx, children.slice(1));
				if (ctx._result) {
					if (!result) {
						result = ctx._result;
					} else {
						if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
							seq = new Fleur.Sequence();
							seq.childNodes = new Fleur.NodeList();
							seq.children = new Fleur.NodeList();
							seq.textContent = "";
							seq.appendChild(result);
							result = seq;
						}
						if (ctx._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
							result.appendChild(ctx._result);
						} else {
							ctx._result.childNodes.forEach(function(n) {
								result.appendChild(n);
							});
						}
					}
				}
				i++;
			}
		}
		ctx._result = result;
		ctx._curr = curr;
	}
};