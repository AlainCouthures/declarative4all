/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.castableExpr] = function(ctx, children, callback) {
	var typename = children[1][1][0][1][0];
	var typeprefix = children[1][1][0][1][1][1][0];
	var typeuri = ctx.env.nsresolver.lookupNamespaceURI(typeprefix);
	var optional = children[1][1].length === 2;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a;
		if (n === Fleur.EmptySequence) {
			a = new Fleur.Text();
			a.data = String(optional);
		} else if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			a = new Fleur.Text();
			a.data = "false";
		} else {
			a = Fleur.Atomize(n);
			try {
				Fleur.Types[typeuri][typename].canonicalize(a.data);
				a.data = "true";
			} catch(e) {
				a.data = "false";
			}
		}
		a.schemaTypeInfo = Fleur.Type_boolean;
		Fleur.callback(function() {callback(a);});
	});
};