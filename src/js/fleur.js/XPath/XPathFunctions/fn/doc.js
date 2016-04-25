/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["doc"] = function(ctx, children, callback) {
	var mediatype = "application/xml";
	if (children.length !== 1 && children.length !== 2) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	var cb = function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSString(a1);
		if (op1[0] < 0) {
			callback(a1);
			return;
		}
		var docname = op1[1];
		var httpget = docname.startsWith("http://") || Fleur.inBrowser;
		var fileread = docname.startsWith("file://") || !httpget;
		if (httpget) {
			if (docname.startsWith("http://")) {
				docname = docname.substr(7);
			}
			var getp = new Promise(function(resolve, reject) {
				var req = new XMLHttpRequest();
				req.open('GET', docname, true);
				req.onload = function() {
					if (req.status === 200) {
						resolve(req.responseText);
					} else {
						reject(Fleur.error(ctx, "FODC0002"));
			      	}
				};
				req.send(null);
			});
			getp.then(
				function(s) {
					var parser = new Fleur.DOMParser();
					callback(parser.parseFromString(s, mediatype));
				},
				function(a) {
					callback(a);
				}
			);
		} else if (fileread) {
		}
	};
	if (children.length === 2) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var op2;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSString(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			mediatype = op2[1];
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
		});
	} else {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	}
};