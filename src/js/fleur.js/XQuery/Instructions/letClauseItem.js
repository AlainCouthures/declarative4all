/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.letClauseItem] = function(ctx, children, callback, resarr) {
	//console.log("letClauseItem");
	var i = 0;
	var varname = children[0][1][0][1][0];
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		resarr[i].set(ctx, "", varname, n);
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
};