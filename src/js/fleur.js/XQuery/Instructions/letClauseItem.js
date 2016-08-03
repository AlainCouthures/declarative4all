/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.letClauseItem] = function(ctx, children, callback) {
	var varname = children[0][1][0][1][0];
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
		ctx.env.varresolver.set(ctx, "", varname, n);
		Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.letClauseItem);});
	});
};