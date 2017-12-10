/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_http["send-request#1"] = new Fleur.Function("http://expath.org/ns/http-client", "http:send-request",
	function(request, callback) {
		var method = request.getAttribute("method");
		var href = request.getAttribute("href");
		try {
			if (global && global.http) {
				callback(null);
				return;
			}
		} catch (e) {
			var req = new XMLHttpRequest();
			req.addEventListener("load", function() {
				var seq = new Fleur.Sequence();
				var elt = new Fleur.Element();
				elt.nodeName = "http:response";
				elt.namespaceURI = "http://expath.org/ns/http-client";
				elt.localName = "response";
				elt.prefix = "http";
				elt.childNodes = new Fleur.NodeList();
				elt.children = new Fleur.NodeList();
				elt.textContent = "";
				seq.appendChild(elt);
				var parser = new Fleur.DOMParser();
				var doc = parser.parseFromString(req.responseText, "application/xml");
				seq.appendChild(doc);
				callback(seq);
			});
			req.open(method.toUpperCase(), href);
			req.send();
		}
	},
	null, [{type: Fleur.Node}], false, true, {type: Fleur.Node, occurence: "?"});