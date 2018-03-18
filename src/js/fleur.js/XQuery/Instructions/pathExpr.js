/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.pathExpr] = function(ctx, children, callback) {
//console.log("pathExpr - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	var next;
	var result = Fleur.EmptySequence;
	var tests = [];
	var preds = [];
	children[0][1].forEach(function(child) {
		if (child[0] === Fleur.XQueryX.predicates || child[0] === Fleur.XQueryX.predicate || child[0] === Fleur.XQueryX.lookup) {
			preds.push(child);
		} else {
			tests.push(child);
		}
	});
	if (preds[0] && preds[0][0] === Fleur.XQueryX.predicates) {
		preds = preds[0][1];
	}
	var cb = function(n, eob) {
//console.log("pathExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + (eob ? " - " + (eob === Fleur.XQueryX.pathExpr ? "pathExpr" : "stepExpr") : ""));
		if (eob === Fleur.XQueryX.pathExpr) {
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
		}
		if (n === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(result, Fleur.XQueryX.pathExpr);});
			return;
		}
		var cb2 = function(n) {
			if (children.length === 1) {
				Fleur.callback(function() {callback(n, Fleur.XQueryX.pathExpr);});
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
			Fleur.XQueryEngine[Fleur.XQueryX.pathExpr]({
				_curr: subcurr,
				env: ctx.env
			}, children.slice(1), cb);
		};
		if (preds.length !== 0) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				next = new Fleur.Sequence();
				next.childNodes = new Fleur.NodeList();
				n.childNodes.forEach(function(node) {
					next.appendChild(node);
				});
			} else {
				next = n;
			}
			Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
				_next: next,
				env: ctx.env
			}, preds, function(n) {
				Fleur.callback(function() {preds = []; cb2(n);});
			});
			return;
		}
		cb2(n);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, tests, cb);
};