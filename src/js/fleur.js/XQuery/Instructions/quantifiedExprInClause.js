/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.quantifiedExprInClause] = function(ctx, children, callback, resarr) {
	var i = 0;
	var varname = children[0][1][0][1][0];
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		if (n === Fleur.EmptySequence) {
			resarr.splice(i, 1);
			if (resarr.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence, true);});
				return;
			}
		} else if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			resarr[i].set(ctx, "", varname, n);
			i++;
		} else {
			n.childNodes.forEach(function(e, ie) {
				if (ie === 0) {
					resarr[i].set(ctx, "", varname, e);
				} else {
					var newres = resarr[i].clone();
					newres.set(ctx, "", varname, e);
					resarr.splice(i + ie, 0, newres);
				}
			});
			i += n.childNodes.length;
		}
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
};