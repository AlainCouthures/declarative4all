/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_map["remove#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/map", "map:remove",
	function(m, k) {
		var map = new Fleur.Map();
		var a = Fleur.Atomize(k);
		var i = 0, l = m.entries.length;
		while (i < l) {
			if (m.entries[i].nodeName !== a.nodeValue) {
				map.setEntryNode(m.entries[i].cloneNode(true));
			}
			i++;
		}
		return map;
	},
	null, [{type: Fleur.Node}, {type: Fleur.Node}], false, false, {type: Fleur.Node});