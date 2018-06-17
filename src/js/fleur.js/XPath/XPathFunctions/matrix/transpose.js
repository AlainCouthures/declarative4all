/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_matrix["transpose#1"] = new Fleur.Function("http://www.mathunion.org/matrix", "matrix:transpose",
	function(arg) {
		if (arg === Fleur.EmptySequence) {
			return Fleur.EmptySequence;
		}
		var result = new Fleur.Sequence();
		if (arg.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
			var newnbrow = arg.childNodes[0].childNodes.length;
			if (newnbrow === 1) {
				arg.childNodes.forEach(function(n) {
					result.appendChild(n.childNodes[0]);
				});
			} else {
				var newnbcol = arg.childNodes.length;
				for (var i = 0; i < newnbrow; i++) {
					var newm = new Fleur.Multidim();
					for (var j = 0; j < newnbcol; j++) {
						newm.appendChild(arg.childNodes[j].childNodes[i]);
					}
					result.appendChild(newm);
				} 
			}
		} else {
			arg.childNodes.forEach(function(n) {
				var m = new Fleur.Multidim();
				m.appendChild(n);
				result.appendChild(m);
			});
		}
		return result;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});