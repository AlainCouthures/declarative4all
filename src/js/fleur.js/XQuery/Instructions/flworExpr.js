/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.flworExpr] = function(ctx, children, callback, ncbs) {
	//console.log("flworExpr - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	var result = Fleur.EmptySequence;
	ncbs = ncbs || [];
	var cb = function(n, eob, cbs) {
		//console.log("flworExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + (eob ? " - " + (eob === Fleur.XQueryX.flworExpr ? "flworExpr" : "clause") : ""));
		if (cbs) {
			ncbs = ncbs.concat(cbs);
		}
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.flworExpr);});
			return;
		}
		if (eob === Fleur.XQueryX.flworExpr) {
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
			if (ncbs.length !== 0) {
				Fleur.callback(ncbs.pop());
				return;
			}
			Fleur.callback(function() {callback(result, Fleur.XQueryX.flworExpr);});
			return;
		}
		if (children.length === 1) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.flworExpr);});
			return;
		}
		Fleur.XQueryEngine[Fleur.XQueryX.flworExpr](ctx, children.slice(1), cb, ncbs);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};