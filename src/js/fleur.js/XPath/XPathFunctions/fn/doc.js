/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.extension2contentType = {
	'.css':   'text/css',
	'.csv':   'text/csv',
	'.gif':   'image/gif',
	'.htm':   'text/html',
	'.html':  'text/html',
	'.ico':   'image/x-icon',
	'.jpeg':  'image/jpeg',
	'.jpg':   'image/jpeg',
	'.js':    'application/javascript',
	'.json':  'application/json',
	'.png':   'image/png',
	'.svg':   'image/svg+xml',
	'.txt':   'text/plain',
	'.xhtml': 'application/xhtml+xml',
	'.xml':   'application/xml; charset=utf-8',
	'.xsl':   'text/xsl'
};

Fleur.XPathFunctions_fn["doc#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
	function(docname, ctx, callback) {
		return Fleur.XPathFunctions_fn["doc#3"].jsfunc(docname, null, null, ctx, callback);
	},
	null, [{type: Fleur.Type_string}], true, true, {type: Fleur.Node});

Fleur.XPathFunctions_fn["doc#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
	function(docname, serialization, ctx, callback) {
		return Fleur.XPathFunctions_fn["doc#3"].jsfunc(docname, serialization, null, ctx, callback);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.Node});

Fleur.XPathFunctions_fn["doc#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
	function(docname, serialization, data, ctx, callback) {
		var contentType;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			serialization = op2[1];
			contentType = Fleur.toContentType(serialization);
		}
		var httpget = docname.startsWith("http://") || Fleur.inBrowser;
		var fileread = docname.startsWith("file://") || !httpget;
		var parser = new Fleur.DOMParser();
		if (httpget) {
			if (!Fleur.inBrowser) {
				var options = global.url.parse(docname);
				options.method = (serialization["http-verb"] || "GET").toUpperCase();
				options.headers = serialization["http-headers"] || {};
				if (serialization["http-cookie"]) {
					options.headers.Cookie = serialization["http-cookie"];
				}
				var postdata = null;
				if (data) {
					var ser = new Fleur.Serializer();
					postdata = ser.serializeToString(data, contentType);
					options.headers["Content-Type"] = contentType;
					options.headers["Content-Length"] = postdata.length;
				}
				var resdata = "";
				var hreq = global.http.request(options, function(res) {
					res.setEncoding("utf8");
					res.on("data", function(chunk) {
						resdata += chunk;
					});
					res.on("end", function() {
						callback(parser.parseFromString(resdata, res.headers["Content-Type"] || contentType));
					});
				});
				if (serialization["timeout"]) {
					hreq.setTimeout(parseInt(serialization["timeout"], 10), function() {
						callback(null);
					});
				}
				hreq.on("error", function(e) {
					callback(e);
				});
				if (postdata) {
					hreq.write(postdata);
				}
				hreq.end();
			} else {
				var getp = new Promise(function(resolve, reject) {
					var req = new XMLHttpRequest();
					req.open(serialization && serialization["http-verb"] ? serialization["http-verb"].toUpperCase() : "GET", docname, true);
					req.onload = function() {
						if (req.status === 200) {
							resolve({text: req.responseText, contenttype: serialization ? contentType : req.getResponseHeader("Content-Type")});
						} else {
							reject(Fleur.error(ctx, "FODC0002"));
				      	}
					};
					req.send(null);
				});
				getp.then(
					function(o) {
						callback(parser.parseFromString(o.text, o.contenttype));
					},
					function(a) {
						callback(a);
					}
				);
			}
		} else if (fileread) {
			if (docname.startsWith("file://")) {
				docname = docname.substr(7);
			}
			if (!contentType) {
				contentType = Fleur.extension2contentType[global.path.extname(docname).toLowerCase()] || "application/xml";
			}
			//console.log(docname);
			global.fs.readFile(docname, 'utf8', function(err, file) {
				if (err) {
					callback(Fleur.error(ctx, "FODC0002"));
				} else {
					callback(parser.parseFromString(file, contentType));
				}
			});
		}
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.Node});