/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.predicateExpr] = function(ctx, children, callback, resarr, checkvalue) {
	var i = 0;
	var result = new Fleur.Text();
	result.schemaTypeInfo = Fleur.Type_boolean;
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		var currvalue = Fleur.XPathFunctions_fn["boolean#1"].jsfunc(n);
		if (currvalue instanceof Error) {
			Fleur.callback(function() {callback(Fleur.error(ctx, currvalue.name, currvalue.message));});
			return;
		}		
		if (currvalue === checkvalue) {
			result.data = String(checkvalue);
			Fleur.callback(function() {callback(result);});
			return;
		}		
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
		} else {
			result.data = String(!checkvalue);
			Fleur.callback(function() {callback(result);});
		}
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};