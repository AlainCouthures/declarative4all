/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["default-collation#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:default-collation",
	function() {
		return "http://www.w3.org/2005/xpath-functions/collation/codepoint";
	},
	null, [], false, false, {type: Fleur.Type_string});