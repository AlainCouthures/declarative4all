/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["addEventListener#3"] = new Fleur.Function("http://xqib.org", "addEventListener",
	function(htmlelt, eventname, handler) {
		if (!htmlelt) {
			return null;
		}
		htmlelt.addEventListener(eventname, function(evt) {handler.call(null, [evt]);});
		return null;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Node}], false, false, {type: Fleur.EmptySequence});

Fleur.XPathFunctions_b["addEventListener#4"] = new Fleur.Function("http://xqib.org", "addEventListener",
	function(htmlelt, eventname, handler, capture) {
		if (!htmlelt) {
			return null;
		}
		htmlelt.addEventListener(eventname, function(evt) {handler.call(null, [evt]);}, capture);
		return null;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Node}, {type: Fleur.Type_boolean}], false, false, {type: Fleur.EmptySequence});