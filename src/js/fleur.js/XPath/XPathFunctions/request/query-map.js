/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_request["query-map#0"] = new Fleur.Function("http://exquery.org/ns/request", "request:query-map",
	function(ctx) {
		var map = new Fleur.Map();
		if (ctx.env.request && ctx.env.request.query) {
			ctx.env.request.query.split("&").forEach(function (p) {
				p = p.split("=");
				var entry = new Fleur.Entry();
				entry.nodeName = p[0];
				entry.namespaceURI = null;
				entry.localName = p[0];
				var text = new Fleur.Text();
				text.schemaTypeInfo = Fleur.Type_string;
				text.nodeValue = decodeURIComponent(p[1]);
				entry.appendChild(text);
				map.setEntryNode(entry);
			});
		}
		return map;
	},
	null, [], true, false, {type: Fleur.Node});