/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["getStyle"] = function(ctx, children, callback) {
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (!n.style) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		var htmlelt = n;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			var stylename;
			if (a2 === Fleur.EmptySequence) {
				a2 = new Fleur.Text();
				stylename = "";
			} else {
				if (a2.schemaTypeInfo !== Fleur.Type_string && a2.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
					callback(Fleur.error(ctx, "XPTY0004"));
					return;
				}
				stylename = a2.data;
			}
			a2.data = "" + htmlelt.style[stylename];
			a2.schemaTypeInfo = Fleur.Type_string;
			Fleur.callback(function() {callback(a2);});
		});
	});
};