/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_excel["rc-to-ref#2"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:rc-to-ref",
	function(row, column) {
		var column = column - 1, s = "";
		while (column > 25) {
			s = String.fromCharCode(65 + (column % 26)) + s;
			column = Math.round((column - (column % 26)) / 26) - 1;
		}
		s = String.fromCharCode(65 + column) + s;
		return s + String(row);
	},
	null, [{type: Fleur.Type_integer}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string});