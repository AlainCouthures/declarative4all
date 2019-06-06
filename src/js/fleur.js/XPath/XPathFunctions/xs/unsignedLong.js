/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_xs["unsignedLong#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:unsignedLong",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedLong"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});