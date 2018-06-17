/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_matrix["labels#1"] = new Fleur.Function("http://www.mathunion.org/matrix", "matrix:labels",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.sin(arg);},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});