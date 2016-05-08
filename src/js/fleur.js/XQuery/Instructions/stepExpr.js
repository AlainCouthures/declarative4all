/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.stepExpr] = function(ctx, children, callback) {
	//console.log("stepExpr - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	var next;
	var result = Fleur.EmptySequence;
	var cb = function(n, eob) {
		var subcurr;
		//console.log("stepExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + (eob ? " - " + (eob === Fleur.XQueryX.stepExpr ? "stepExpr" : "predicates") : ""));
		if (eob === Fleur.XQueryX.stepExpr) {
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
			if (eob === Fleur.XQueryX.stepExpr && callback !== cb && children[children.length - 1][0] === Fleur.XQueryX.predicates) {
				Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
					_next: result,
					nsresolver: ctx.nsresolver
				}, children[children.length - 1][1], function(n) {
					callback(n, Fleur.XQueryX.stepExpr);
				});
				return;
			}
			callback(result, Fleur.XQueryX.stepExpr);
			return;
		}
		if (children.length === 1) {
			callback(n, Fleur.XQueryX.stepExpr);
			return;
		}
		if (children.length === 2 && children[1][0] === Fleur.XQueryX.predicates) {
			if (callback !== cb) {
				Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
					_next: n,
					nsresolver: ctx.nsresolver
				}, children[1][1], function(n) {
					callback(n, Fleur.XQueryX.stepExpr);
				});
				return;
			}
			callback(n, Fleur.XQueryX.stepExpr);
			return;
		}
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
		Fleur.XQueryEngine[Fleur.XQueryX.stepExpr]({
				_curr: subcurr,
				nsresolver: ctx.nsresolver
			}, children.slice(1), cb);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};