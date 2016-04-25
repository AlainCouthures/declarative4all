/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.predicates] = function(ctx, children, callback) {
	var next;
	var result = Fleur.EmptySequence;
	var cb = function(n, eob) {
		if (eob === Fleur.XQueryX.predicates) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
				}
			}
			n = next;
		} else {
			if ((n === Fleur.Node.SEQUENCE_NODE && n.childNodes.length !== 0) ||
				(n === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_boolean && n.data === "true") ||
				(n === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_integer && parseInt(n.data, 10) === ctx._pos)) {
					n = ctx._curr;
			} else {
				n = Fleur.EmptySequence;
			}
		}
		if (n === Fleur.EmptySequence) {
			callback(n, Fleur.XQueryX.predicates);
			return;
		}
		if (children.length === 1) {
			callback(n, Fleur.XQueryX.predicates);
			return;
		}
		var subcurr;
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			subcurr = n.childNodes.shift();
			if (n.childNodes.length === 1) {
				n = n.childNodes[0];
			}
		} else {
			subcurr = n;
			n = Fleur.EmptySequence;
		}
		next = n;
		Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
				_curr: subcurr,
				_last: 0,
				_pos: 0,
				nsresolver: ctx.nsresolver
			}, children.slice(1), cb);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
/*
	var curr, result, newresult, seq, i, l;
	if (children.length === 0) {
		return;
	}
	curr = ctx._curr;
	result = ctx._result;
	if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		ctx._curr = result;
		ctx._result = Fleur.EmptySequence;
		ctx._pos = ctx._last = 1;
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
		if (ctx._result === Fleur.EmptySequence) {
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
		newresult = Fleur.EmptySequence;
		ctx._last = l;
		while (i < l) {
			ctx._pos = i + 1;
			ctx._curr = result.childNodes[i];
			ctx._result = Fleur.EmptySequence;
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
			if (ctx._result === Fleur.EmptySequence) {
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
			if (newresult === Fleur.EmptySequence) {
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
*/