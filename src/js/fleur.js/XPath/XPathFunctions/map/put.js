/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_map["put#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/map", "map:put",
	function(m, k, v) {
		var map = new Fleur.Map();
		var a = Fleur.Atomize(k);
		var i = 0, l = m.entries.length;
		while (i < l) {
			if (m.entries[i].nodeName !== a.nodeValue) {
				map.setEntryNode(m.entries[i].cloneNode(true));
			}
			i++;
		}
		var entry = new Fleur.Entry();
		entry.nodeName = a.nodeValue;
		entry.namespaceURI = null;
		entry.localName = a.nodeValue;
		entry.appendChild(v.cloneNode(true));
		map.setEntryNode(entry);
		return map;
	},
	null, [{type: Fleur.Node}, {type: Fleur.Node}, {type: Fleur.Node}], false, false, {type: Fleur.Node});