/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.letClause] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n, eob) {
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.letClause);});
			return;
		} 
		if (children.length <= 1) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.letClause);});
			return;
		} 
		Fleur.XQueryEngine[Fleur.XQueryX.letClause](ctx, children.slice(1), callback);
	});
};