/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["number"] = function(ctx, children, callback) {
	if (children.length > 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var cb = function(n) {
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a === Fleur.EmptySequence) {
			a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_double;
			a.data = "NaN";
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_boolean) {
			a.schemaTypeInfo = Fleur.Type_double;
			a.data = a.data === "true" ? "1.0e0" : "0.0e0";
			Fleur.callback(function() {callback(a);});
			return;
		}
		a.schemaTypeInfo = Fleur.Type_double;
		if (!(/^\s*(([\-+]?([0-9]+(\.[0-9]*)?)|(\.[0-9]+))([eE][-+]?[0-9]+)?|-?INF|NaN)\s*$/.test(a.data))) {
			a.data = "NaN";
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.data !== "INF" && a.data !== "-INF" && a.data !== "NaN") {
			a.data = ("" + parseFloat(a.data)).replace("e+", "e");
		}
		Fleur.callback(function() {callback(a);});
	};
	if (children.length === 0) {
		cb(ctx._curr);
	} else {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	}
};
