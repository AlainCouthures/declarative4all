/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_map["merge#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/map", "map:merge",
	function(maps) {
		return Fleur.XPathFunctions_map["merge#2"].jsfunc(maps, null);
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node});

Fleur.XPathFunctions_map["merge#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/map", "map:merge",
	function(maps, options) {
		var e, i, l;
		if (maps.nodeType === Fleur.Node.MAP_NODE) {
			return maps.copyNode();
		}
		e = new Error("The dynamic type of a value does not match a required type for Q{http://www.w3.org/2005/xpath-functions/map}merge#" + (options ? "2" : "1"));
		e.name = "XPTY0004";
		if (maps.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return e;
		}
		var duplicates;
		if (!options) {
			duplicates = "use-first";
		} else {
			var dentry = options.getEntryNode("duplicates");
			duplicates = dentry ? dentry.textContent : "use-first";
		}
		if (maps.childNodes[0].nodeType !== Fleur.Node.MAP_NODE) {
			return e;
		}
		var map = maps.childNodes[0].copyNode();
		for (i = 1, l = maps.childNodes.length; i < l; i++) {
			var extend = maps.childNodes[i].copyNode();
			extend.entries.forEach(function(exent) {
				if (map.hasEntry(exent.nodeName)) {
					switch (duplicates) {
						case "use-last":
							map.setEntryNode(exent.copyNode());
							break;
					}
				} else {
					map.setEntryNode(exent.copyNode());
				}
			});
		}
		return map;
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Node}], false, false, {type: Fleur.Node});