/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_internal["get-id#1"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "internal:get-id",
	function(node) {
		if (node === Fleur.EmptySequence) {
			return null;
		}
		return node.internal_id || "undefined";
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "?"});