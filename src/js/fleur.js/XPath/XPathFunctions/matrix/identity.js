/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_matrix["identity#1"] = new Fleur.Function("http://www.mathunion.org/matrix", "matrix:identity",
	function(arg) {
		if (arg === null) {
			return Fleur.EmptySequence;
		}
		var result;
		if (arg === 1) {
			result = new Fleur.Text();
			result.data = "1";
			result.schemaTypeInfo = Fleur.Type_integer;
		} else {
			result = new Fleur.Sequence();
			for (var i = 0; i < arg; i++) {
				var m = new Fleur.Multidim();
				for (var j = 0; j < arg; j++) {
					var n = new Fleur.Text();
					n.data = i === j ? "1" : "0";
					n.schemaTypeInfo = Fleur.Type_integer;
					m.appendChild(n);
				}
				result.appendChild(m);
			}
		}
		return result;
	},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});