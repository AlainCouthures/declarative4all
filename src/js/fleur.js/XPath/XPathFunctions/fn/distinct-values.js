/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["distinct-values#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:distinct-values",
	function(arg) {
		if (arg === Fleur.EmptySequence || arg.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return arg;
		}
		var result = new Fleur.Sequence();
		arg.childNodes.forEach(function(c) {
			var a = Fleur.Atomize(c);
			if (!result.childNodes.some(function(r) {
					if ((a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) &&
						(r.schemaTypeInfo === Fleur.Type_string || r.schemaTypeInfo === Fleur.Type_untypedAtomic)) {
						return a.data === r.data;
					}
					if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1 &&
						Fleur.numericTypes.indexOf(r.schemaTypeInfo) !== -1) {
						return (a.data === "INF" && r.data === "INF") ||
							(a.data === "-INF" && r.data === "-INF") ||
							(a.data === "NaN" && r.data === "NaN") ||
							parseFloat(a.data) === parseFloat(r.data);
					}
					return a.schemaTypeInfo === r.schemaTypeInfo && a.data === r.data;
				})) {
				result.appendChild(a);
			}
		});
		if (result.childNodes.length === 1) {
			result = result.childNodes[0];
		}
		return result;
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});