/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.quantifiedExpr] = function(ctx, children, callback) {
	var i = 1;
	var prevvarres;
	var resarr;
	var checkvalue = children[0][1][0] === "some";
	var cb = function(n, empty) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (empty) {
			var result = new Fleur.Text();
			result.schemaTypeInfo = Fleur.Type_boolean;
			result.data = String(!checkvalue);
			Fleur.callback(function() {callback(result);});
			return;
		}
		i++;
		if (i === children.length) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb, resarr, checkvalue);
	};
	prevvarres = ctx.env.varresolver;
	resarr = [new Fleur.varMgr([], prevvarres)];
	Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], cb, resarr);
};