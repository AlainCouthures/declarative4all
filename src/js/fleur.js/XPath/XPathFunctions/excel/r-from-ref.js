/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_excel["r-from-ref#1"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:r-from-ref",
	function(arg) {
		var i = 0, l = arg.length, row = 0, c = arg.charCodeAt(i);
		while (i < l && c >= 65 && c <= 90) {
			i++;
		}
		while (i < l && c >= 48 && c <= 57) {
			row = row * 10 + c - 48;
			c = arg.charCodeAt(++i);
		}
		return row;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_integer});