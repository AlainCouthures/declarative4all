/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_excel["c-from-ref#1"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:c-from-ref",
	function(arg) {
		var i = 0, l = arg.length, column = 0, c = arg.charCodeAt(i);
		while (i < l && c >= 65 && c <= 90) {
			column = column * 26 + c - 64;
			c = arg.charCodeAt(++i);
		}
		return column;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_integer});