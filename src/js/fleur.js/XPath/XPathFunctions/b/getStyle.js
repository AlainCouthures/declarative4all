/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["getStyle#2"] = new Fleur.Function("http://xqib.org", "getStyle",
	function(htmlelt, stylepropertyname) {
		if (!htmlelt) {
			return null;
		}
		return htmlelt.style[stylepropertyname];
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});