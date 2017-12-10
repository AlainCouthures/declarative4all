/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.lookup] = function(ctx, children, callback) {
//console.log("lookup - " + pos + " - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	if (ctx._curr.nodeType !== Fleur.Node.MAP_NODE) {
		Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.lookup);});
	} else if (children[0][0] === Fleur.XQueryX.NCName) {
		Fleur.callback(function() {callback(ctx._curr.getEntryNode(children[0][1][0]) || Fleur.EmptySequence, Fleur.XQueryX.lookup);});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				Fleur.callback(function() {callback(ctx._curr.getEntryNode(a.data) || Fleur.EmptySequence, Fleur.XQueryX.lookup);});
			}
		});
	}
};