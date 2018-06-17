/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["concat#"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat",
	function() {
		var s = "";
		for (var i = 0, l = arguments.length; i < l; i++) {
			var n = arguments[i];
			if (n !== Fleur.EmptySequence && n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				var e = new Error("The dynamic type of a value does not match a required type for Q{http://www.w3.org/2005/xpath-functions}concat#" + String(l));
				e.name = "XPTY0004";
				return e;
			}
			var a = Fleur.Atomize(n);
			if (a.schemaTypeInfo === Fleur.Type_error) {
				return a;
			}
			s += a.data || "";
		}
		return s;
	},
	null, [], false, false, {type: Fleur.Type_string});