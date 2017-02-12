/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_math["atan#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:atan",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.atan(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});