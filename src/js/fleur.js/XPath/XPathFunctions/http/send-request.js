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
		return Fleur.XPathFunctions_http["send-request#3"].jsfunc(request, null, null, callback);
	},
	null, [{type: Fleur.Node}], false, true, {type: Fleur.Node, occurence: "?"});

Fleur.XPathFunctions_http["send-request#2"] = new Fleur.Function("http://expath.org/ns/http-client", "http:send-request",
	function(request, href, callback) {
		return Fleur.XPathFunctions_http["send-request#3"].jsfunc(request, href, null, callback);
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}], false, true, {type: Fleur.Node, occurence: "?"});

Fleur.XPathFunctions_http["send-request#3"] = new Fleur.Function("http://expath.org/ns/http-client", "http:send-request",
	function(request, href, body, callback) {
		var method = request.getAttribute("method");
		href = href || request.getAttribute("href");
		if (body === Fleur.EmptySequence) {
			body = null;
		}
		if (body) {
			var b2 = body.documentElement || body;
			var contenttype;
			switch (b2.nodeType) {
				case Fleur.Node.ELEMENT_NODE:
					if (b2.nodeName === "html") {
						if (body.nodeType === Fleur.Node.DOCUMENT_NODE) {
							for (var i = 0, l = body.childNodes.length; i < l; i++) {
								if (body.childNodes[i].nodeType === Fleur.Node.PROCESSING_INSTRUCTION_NODE && body.childNodes[i].nodeName === "xml-stylesheet") {
									contenttype = "application/xml";
									break;
								}
							}
						}
						contenttype = "text/html";
						break;
					}
					contenttype = "application/xml";
					break;
				case Fleur.Node.SEQUENCE_NODE:
					contenttype = "application/xml";
					break;
				case Fleur.Node.MAP_NODE:
					contenttype = "application/json";
					break;
				default:
					contenttype = "text/plain";
			}
			var ser = new Fleur.Serializer();
			body = ser.serializeToString(body, contenttype);
		}
		var parser = new Fleur.DOMParser();
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
		var doc;
		try {
			if (global && global.http) {
				var options = global.url.parse(href);
				options.method = (method || "GET").toUpperCase();
				options.headers = {};
				if (body) {
					options.headers["Content-Type"] = contenttype;
					options.headers["Content-Length"] = body.length;
				}
				var resdata = "";
				var hreq = global.http.request(options, function(res) {
					res.setEncoding("utf8");
					res.on("data", function(chunk) {
						resdata += chunk;
					});
					res.on("end", function() {
						if (resdata !== "") {
							doc = parser.parseFromString(resdata, res.headers["Content-Type"] || res.headers["content-type"] || contenttype);
							seq.appendChild(doc);
						}
						callback(seq);
					});
				});
				hreq.on("error", function(e) {
					callback(e);
				});
				if (body) {
					hreq.write(body);
				}
				hreq.end();
				return;
			}
		} catch (e) {
			var req = new XMLHttpRequest();
			req.addEventListener("load", function() {
				if (req.responseText !== "") {
					var mediatype = req.getResponseHeader('Content-Type') ? req.getResponseHeader('Content-Type') : "application/xml";
					var lines = mediatype.split(";");
					doc = parser.parseFromString(req.responseText, lines[0]);
					seq.appendChild(doc);
				}
				callback(seq);
			});
			req.open(method.toUpperCase(), href);
			if (!body || body === Fleur.EmptySequence) {
				req.send();
			} else {
				req.setRequestHeader("Content-Type", contenttype);
				req.send(body);
			}
		}
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, true, {type: Fleur.Node, occurence: "?"});