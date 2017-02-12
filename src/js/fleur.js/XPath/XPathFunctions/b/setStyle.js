/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["setStyle#3"] = new Fleur.Function("http://xqib.org", "b:setStyle",
	function(htmlelt, stylepropertyname, stylepropertyvalue) {
		if (!htmlelt) {
			return null;
		}
		htmlelt.style[stylepropertyname] = stylepropertyvalue;
		return null;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.EmptySequence});