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
	Fleur.callback(function() {callback((ctx._curr.nodeType === Fleur.Node.MAP_NODE ? ctx._curr.getEntryNode(children[0][1][0]): null) || Fleur.EmptySequence, Fleur.XQueryX.lookup);});
};