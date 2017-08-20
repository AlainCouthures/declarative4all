/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_dgram["socket-close#1"] = new Fleur.Function("http://www.agencexml.com/fleur/dgram", "dgram:socket-close",
	function(sock) {
		console.log("close");
		sock.close();
	},
	null, [{type: Fleur.Type_handler}], false, false, {type: Fleur.EmptySequence});