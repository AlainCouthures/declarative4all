/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.predicates] = function(ctx, children) {
	var curr, result, newresult, seq, i, l;
	if (children.length === 0) {
		return;
	}
	curr = ctx._curr;
	result = ctx._result;
	if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		ctx._curr = result;
		ctx._result = null;
		ctx._pos = ctx._last = 1;
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
		if (!ctx._result) {
			ctx._curr = curr;
			return;
		}
		if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (ctx._result.childNodes.length === 0) {
				ctx._curr = curr;
				ctx._result = null;
				return;
			}
		} else if (ctx._result.nodeType === Fleur.Node.TEXT_NODE && ctx._result.schemaTypeInfo === Fleur.Type_boolean) {
			if (ctx._result.data === "false") {
				ctx._curr = curr;
				ctx._result = null;
				return;
			}
		} else if (ctx._result.nodeType === Fleur.Node.TEXT_NODE && ctx._result.schemaTypeInfo === Fleur.Type_integer) {
			if (parseInt(ctx._result.data, 10) !== 1) {
				ctx._curr = curr;
				ctx._result = null;
				return;
			}
		}
		ctx._result = result;
		ctx._curr = curr;
		Fleur.XQueryEngine[Fleur.XQueryX.predicates](ctx, children.slice(1));
	} else {
		l = result.childNodes.length;
		i = 0;
		newresult = null;
		ctx._last = l;
		while (i < l) {
			ctx._pos = i + 1;
			ctx._curr = result.childNodes[i];
			ctx._result = null;
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
			if (!ctx._result) {
				i++;
				continue;
			}
			if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (ctx._result.childNodes.length === 0) {
					i++;
					continue;
				}
			} else if (ctx._result.nodeType === Fleur.Node.TEXT_NODE && ctx._result.schemaTypeInfo === Fleur.Type_boolean) {
				if (ctx._result.data === "false") {
					i++;
					continue;
				}
			} else if (ctx._result.nodeType === Fleur.Node.TEXT_NODE && ctx._result.schemaTypeInfo === Fleur.Type_integer) {
				if (parseInt(ctx._result.data, 10) !== i + 1) {
					i++;
					continue;
				}
			}
			if (!newresult) {
				newresult = result.childNodes[i];
			} else {
				if (newresult.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					seq.appendChild(newresult);
					newresult = seq;
				}
				newresult.appendChild(result.childNodes[i]);
			}
			i++;
		}
		ctx._curr = curr;
		ctx._result = newresult;
		Fleur.XQueryEngine[Fleur.XQueryX.predicates](ctx, children.slice(1));
	}
};