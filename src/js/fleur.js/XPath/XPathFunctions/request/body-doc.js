/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_request["body-doc#0"] = new Fleur.Function("http://exquery.org/ns/request", "request:body-doc",
	function(ctx) {
		return Fleur.XPathFunctions_request["body-doc#1"].jsfunc(null, ctx);
	},
	null, [], true, false, {type: Fleur.Node});

Fleur.XPathFunctions_request["body-doc#1"] = new Fleur.Function("http://exquery.org/ns/request", "request:body-doc",
	function(serialization, ctx) {
		if (ctx.env.request && ctx.env.request.body) {
			var contentType;
			if (serialization) {
				var a2 = Fleur.Atomize(serialization);
				var	op2 = Fleur.toJSObject(a2);
				if (op2[0] < 0) {
					return a2;
				}
				serialization = op2[1];
				contentType = Fleur.toContentType(serialization);
			}
			if (!contentType) {
				contentType = ctx.env.request.headers["Content-Type"] || ctx.env.request.headers["content-type"];
			}
			var parser = new Fleur.DOMParser();
			return parser.parseFromString(ctx.env.request.body, contentType);
		}
		return Fleur.EmptySequence;
	},
	null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Node});