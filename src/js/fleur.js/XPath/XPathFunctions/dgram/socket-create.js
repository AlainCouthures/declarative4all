/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_dgram["socket-create#1"] = new Fleur.Function("http://www.agencexml.com/fleur/dgram", "dgram:socket-create",
	function(protocol) {
		console.log("create");
		return global.dgram.createSocket(protocol);
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_handler});