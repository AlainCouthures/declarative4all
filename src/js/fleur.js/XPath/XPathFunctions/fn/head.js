/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["head#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:head",
	function(arg) {
		return arg === Fleur.EmptySequence || arg.nodeType !== Fleur.Node.SEQUENCE_NODE ? arg : arg.childNodes[0];
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node});