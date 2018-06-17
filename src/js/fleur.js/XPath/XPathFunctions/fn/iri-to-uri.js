/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["iri-to-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:iri-to-uri",
	function(iri) {
		return iri !== null ? iri.replace(/([^!-~]|[<>"{}|\\\^\`])/g, function(c) {return encodeURIComponent(c);}) : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});