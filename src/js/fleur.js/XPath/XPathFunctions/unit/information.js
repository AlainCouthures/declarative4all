/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_unit["information#1"] = new Fleur.Function("http://www.agencexml.com/fleur/unit", "unit:information",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.agencexml.com/fleur/unit"]["information"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});