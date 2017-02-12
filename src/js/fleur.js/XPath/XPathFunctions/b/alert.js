/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["alert#1"] = new Fleur.Function("http://xqib.org", "b:alert",
	function(s) {
		alert(s);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.EmptySequence});