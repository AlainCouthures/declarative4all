/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.orderBySpec] = function(ctx, children, callback, resarr, orderkeyvalues) {
	//console.log("orderBySpec");
	var i = 0;
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		var jsv = Fleur.toJSValue(n, true, true, true, true);
		orderkeyvalues.push(jsv);
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], cb);
};