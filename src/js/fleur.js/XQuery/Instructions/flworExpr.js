/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.flworExpr] = function(ctx, children, callback) {
	var i = 0;
	var prevvarres;
	var resarr;
	var cb = function(n) {
		//console.log("flworExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
		if (n.schemaTypeInfo === Fleur.Type_error) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		i++;
		if (i === children.length) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb, resarr);
	};
	prevvarres = ctx.env.varresolver;
	resarr = [new Fleur.varMgr([], prevvarres)];
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb, resarr);
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.flworExpr] = function(ctx, children, callback, ncbs) {
	console.log("flworExpr - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	var result = Fleur.EmptySequence;
	ncbs = ncbs || [];
	var i = 0;
	var cb = function(n, eob, cbs) {
		console.log("flworExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + (eob ? " - " + (eob === Fleur.XQueryX.flworExpr ? "flworExpr" : eob === Fleur.XQueryX.forClause ? "forClause" : "letClause") : ""));
		if (cbs) {
			ncbs = ncbs.concat(cbs);
		}
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.flworExpr);});
			return;
		}
		if (eob === Fleur.XQueryX.flworExpr) {
			console.log("Got " + (n.nodeType !== Fleur.Node.SEQUENCE_NODE ? "text": "sequence") + "!");
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					result = n;
					console.log("result = n :" + (n.nodeType !== Fleur.Node.SEQUENCE_NODE ? 1 : result.childNodes.length));
				} else {
					if (newresult === Fleur.EmptySequence || newresult.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						if (result !== Fleur.EmptySequence) {
							seq.appendChild(result);
						}
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
					console.log(result.childNodes.length);
				}
			}
			if (ncbs.length !== 0) {
				Fleur.callback(ncbs.pop());
				return;
			}
			Fleur.callback(function() {callback(result, Fleur.XQueryX.flworExpr);});
			return;
		}
		i++;
		if (i === children.length) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.flworExpr);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb, ncbs);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
*/