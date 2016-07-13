/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.anyKindTest] = function(ctx, children, callback) {
	//console.log("anyKindTest - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	Fleur.callback(function() {callback(ctx._curr);});
};