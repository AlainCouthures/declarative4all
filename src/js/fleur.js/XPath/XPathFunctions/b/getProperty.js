/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["getProperty#2"] = new Fleur.Function("http://xqib.org", "b:getProperty",
	function(htmlelt, propertyname) {
		if (!htmlelt) {
			return null;
		}
		return String(htmlelt[propertyname]);
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});

Fleur.XPathFunctions_b["getProperty#1"] = new Fleur.Function("http://xqib.org", "b:getProperty",
	function(propertyname, ctx) {
		return String(ctx._curr[propertyname]);
	},
	null, [{type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});