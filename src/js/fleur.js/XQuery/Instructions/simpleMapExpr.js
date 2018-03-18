/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.simpleMapExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		//console.log("simpleMapExpr - " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
		var subcurr, next, last, pos = 1, result = Fleur.EmptySequence;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		next = n;
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			next = new Fleur.Sequence();
			next.childNodes = new Fleur.NodeList();
			for (var i = 0, l = n.childNodes.length; i < l; i++) {
				next.appendChild(n.childNodes[i]);
			}
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
		var cb = function(n) {
			//console.log("simpleMapExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
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
			if (next === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.simpleMapExpr);});
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
			Fleur.XQueryEngine[children[1][0]]({
				_curr: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				env: ctx.env
			}, children[1][1], cb);
		};
		Fleur.XQueryEngine[children[1][0]]({
			_curr: subcurr,
			_next: next,
			_last: last,
			_pos: pos,
			env: ctx.env
		}, children[1][1], cb);
	});
};