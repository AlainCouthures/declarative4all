/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.doubleMapExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		//console.log("doubleMapExpr - " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
		var seq, md, subcurr, next, last, pos = 1, result = Fleur.EmptySequence;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE && n.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
			next = new Fleur.Sequence();
			for (var i = 0, l = n.childNodes.length; i < l; i++) {
				next.appendChild(n.childNodes[i]);
			}
			next.rowlabels = n.rowlabels;
			next.collabels = n.collabels;
			last = next.childNodes.length;
			subcurr = next.childNodes.shift();
			seq = new Fleur.Sequence();
			seq.childNodes = subcurr.childNodes;
			subcurr = seq;
			subcurr.collabels = next.collabels;
			if (next.childNodes.length === 0) {
				next = Fleur.EmptySequence;
			}
		} else {
			subcurr = n;
			next = Fleur.EmptySequence;
			last = 1;
		}
		var cb = function(n) {
			//console.log("doubleMapExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						seq = new Fleur.Sequence();
						md = new Fleur.Multidim();
						seq.appendChild(md);
						md.appendChild(result);
						result = seq;
					} else if (result.childNodes[0].nodeType !== Fleur.Node.MULTIDIM_NODE) {
						seq = new Fleur.Sequence();
						md = new Fleur.Multidim();
						seq.appendChild(md);
						result.childNodes.forEach(function(node) {
							md.appendChild(node);
						});
						result = seq;
					}
					md = new Fleur.Multidim();
					result.appendChild(md);
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						md.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							md.appendChild(node);
						});
					}
				}
			}
			if (next === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.doubleMapExpr);});
				return;
			}
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				subcurr = next.childNodes.shift();
				if (subcurr.nodeType === Fleur.Node.MULTIDIM_NODE) {
					seq = new Fleur.Sequence();
					seq.childNodes = subcurr.childNodes;
					subcurr = seq;
					subcurr.collabels = next.collabels;
					if (next.childNodes.length === 0) {
						next = Fleur.EmptySequence;
					}
				} else {
					subcurr.collabels = next.collabels;
					if (next.childNodes.length === 1) {
						next = next.childNodes[0];
					}
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