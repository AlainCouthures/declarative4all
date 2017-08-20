/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_dgram["socket-send#4"] = new Fleur.Function("http://www.agencexml.com/fleur/dgram", "dgram:socket-send",
	function(sock, packet, address, port, callback) {
		//sock.send(packet, 0, packet.length, port, address, function() {
		//		callback(null);
		//});
		console.log(packet[6].toString(16) + ":" + packet[7].toString(16) + ":" + packet[8].toString(16) + ":" + packet[9].toString(16) + ":" + packet[10].toString(16) + ":" + packet[11].toString(16) + " " + address + ":" + port);
		callback(null);
	},
	null, [{type: Fleur.Type_handler}, {type: Fleur.Type_integer, occurence: "+"}, {type: Fleur.Type_ipv4}, {type: Fleur.Type_port}], false, true, {type: Fleur.EmptySequence});