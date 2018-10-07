/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_matrix["labels#2"] = new Fleur.Function("http://www.mathunion.org/matrix", "matrix:labels",
	function(collabels, arg) {
		return Fleur.XPathFunctions_matrix["labels#3"].jsfunc(Fleur.EmptySequence, collabels, arg);
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});

Fleur.XPathFunctions_matrix["labels#3"] = new Fleur.Function("http://www.mathunion.org/matrix", "matrix:labels",
	function(rowlabels, collabels, arg) {
		if (arg === Fleur.EmptySequence) {
			return Fleur.EmptySequence;
		}
		var atomlabels = function(n) {
			var a;
			var res = [];
			if (n === Fleur.EmptySequence) {
				return null;
			}
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				n.childNodes.forEach(function(n2) {
					a = Fleur.Atomize(n2);
					res.push(a.data);
				});
			} else {
				a = Fleur.Atomize(n);
				res.push(a.data);
			}
			return res;
		}
		arg.rowlabels = atomlabels(rowlabels);
		arg.collabels = atomlabels(collabels);
		return arg;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});