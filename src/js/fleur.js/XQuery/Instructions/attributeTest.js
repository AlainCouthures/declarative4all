/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.attributeTest] = function(ctx, children, callback) {
  //console.log("attributeTest - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
  Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ATTRIBUTE_NODE || ctx._curr.nodeName === "xmlns" || ctx._curr.prefix === "xmlns" ? Fleur.EmptySequence : ctx._curr);});
};