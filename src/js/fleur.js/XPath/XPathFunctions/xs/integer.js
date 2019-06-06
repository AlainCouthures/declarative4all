/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["integer#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:integer",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_integer, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});