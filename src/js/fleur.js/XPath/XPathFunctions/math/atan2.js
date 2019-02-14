/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_math["atan2#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:atan2",
	function(arg1, arg2) {
		return Math.atan2(Number(arg1), Number(arg2));},
	null, [{type: Fleur.numericTypes}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Type_double, occurence: "?"});