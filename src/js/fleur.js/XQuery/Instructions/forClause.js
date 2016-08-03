/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.forClause] = function(ctx, children, callback, cbs) {
	cbs = cbs || [];
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n, eob, cb) {
		if (cb) {
			cbs.push(cb);
		}
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.forClause);});
			return;
		} 
		if (children.length <= 1) {
			var tmp = cbs.splice(0);
			cbs = [];
			Fleur.callback(function() {callback(n, Fleur.XQueryX.forClause, tmp);});
			return;
		} 
		Fleur.XQueryEngine[Fleur.XQueryX.forClause](ctx, children.slice(1), callback, cbs);
	});
};