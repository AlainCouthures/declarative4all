/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.simpleMapExpr] = function(ctx, children) {
	var curr, result, newresult, seq, i, l;
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	if (!ctx._result || ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	curr = ctx._curr;
	result = ctx._result;
	if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		ctx._curr = result;
		ctx._result = null;
		ctx._pos = ctx._last = 1;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1]);
	} else {
		l = result.childNodes.length;
		i = 0;
		newresult = null;
		ctx._last = l;
		while (i < l) {
			ctx._pos = i + 1;
			ctx._curr = result.childNodes[i];
			ctx._result = null;
			Fleur.XQueryEngine[children[1][0]](ctx, children[1][1]);
			if (!ctx._result) {
				i++;
				continue;
			}
			if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (ctx._result.childNodes.length === 0) {
					i++;
					continue;
				}
			}
			if (!newresult) {
				newresult = ctx._result;
			} else {
				if (newresult.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					seq.appendChild(newresult);
					newresult = seq;
				}
				if (ctx._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					newresult.appendChild(ctx._result);
				} else {
					ctx._result.childNodes.forEach(function(n) {
						newresult.appendChild(n);
					});
				}
			}
			i++;
		}
		ctx._curr = curr;
		ctx._result = newresult;
	}
};