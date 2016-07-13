/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.sequenceExpr] = function(ctx, children, callback, depth) {
	if (!depth) {
		depth = 0;
	}
	if (children.length === 0) {
		Fleur.callback(function() {callback(Fleur.EmptySequence, depth);});
		return;
	}
	var result = Fleur.EmptySequence;
	var cb = function(n, eob) {
		if (eob === depth) {
			if (result === Fleur.EmptySequence) {
				result = n;
			} else if (n !== Fleur.EmptySequence) {
				if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var seq = new Fleur.Sequence();
					seq.appendChild(result);
					result = seq;
				}
				if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					result.appendChild(n);
				} else {
					n.childNodes.forEach(function(child) {result.appendChild(child);});
				}
			}
			Fleur.callback(function() {callback(result, depth);});
			return;
		}
		if (children.length === 1) {
			Fleur.callback(function() {callback(n, depth);});
			return;
		}
		result = n;
		Fleur.XQueryEngine[Fleur.XQueryX.sequenceExpr](ctx, children.slice(1), cb, depth);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb, children[0][0] === Fleur.XQueryX.sequenceExpr ? depth + 1 : depth);
};