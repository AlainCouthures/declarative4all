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
	var next = ctx._next;
	var last;
	var pos = 1;
	console.log("predicates - " + Fleur.Serializer._serializeNodeToXQuery(next, false, ""));
	var result = Fleur.EmptySequence;
	var subcurr;
	if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
		last = next.childNodes.length;
		subcurr = next.childNodes.shift();
		if (next.childNodes.length === 1) {
			next = next.childNodes[0];
		}
	} else {
		subcurr = next;
		next = Fleur.EmptySequence;
		last = 1;
	}
	var cb = function(n, eob) {
		console.log("predicates - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + (eob ? " - " + (eob === Fleur.XQueryX.predicates ? "predicates" : eob) : ""));
		if (eob === Fleur.XQueryX.predicates) {
			callback(n, Fleur.XQueryX.predicates);
			return;
		}
		if ((n.nodeType === Fleur.Node.SEQUENCE_NODE && n.childNodes.length !== 0) ||
			(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_boolean && n.data !== "false") ||
			(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_integer && parseInt(n.data, 10) === pos) ||
			(n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.TEXT_NODE)) {
			if (result === Fleur.EmptySequence) {
				result = subcurr;
			} else {
				if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					seq.appendChild(result);
					result = seq;
				}
				result.appendChild(subcurr);
			}
		}
		if (next === Fleur.EmptySequence) {
			if (children.length === 1 || result === Fleur.EmptySequence) {
				callback(result, Fleur.XQueryX.predicates);
				return;
			}
			children.shift();
			next = result;
			result = Fleur.EmptySequence;
			pos = 1;
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				last = next.childNodes.length;
				subcurr = next.childNodes.shift();
				if (next.childNodes.length === 1) {
					next = next.childNodes[0];
				}
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
				last = 1;
			}
			Fleur.XQueryEngine[children[0][0]]({
						_curr: subcurr,
						_next: next,
						_last: last,
						_pos: pos,
						nsresolver: ctx.nsresolver
					}, children[0][1], cb);
			return;
		}
		if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
			subcurr = next.childNodes.shift();
			if (next.childNodes.length === 1) {
				next = next.childNodes[0];
			}
		} else {
			subcurr = next;
			next = Fleur.EmptySequence;
		}
		pos++;
		Fleur.XQueryEngine[children[0][0]]({
					_curr: subcurr,
					_next: next,
					_last: last,
					_pos: pos,
					nsresolver: ctx.nsresolver
				}, children[0][1], cb);
	};
	Fleur.XQueryEngine[children[0][0]]({
				_curr: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				nsresolver: ctx.nsresolver
			}, children[0][1], cb);
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