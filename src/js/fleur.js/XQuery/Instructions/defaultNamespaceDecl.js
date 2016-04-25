/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.defaultNamespaceDecl] = function(ctx, children) {
	alert(children[0][1][0] + ": '" + children[1][1][0] + "'");
};