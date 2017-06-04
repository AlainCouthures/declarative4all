/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
if ((new Function("try {return this === window;} catch(e) {return false;}"))()) {
	document.addEventListener('DOMContentLoaded', function() {
		var scripts = Array.prototype.slice.call(document.getElementsByTagName("script"), 0).filter(function(sc) {
			return sc.getAttribute("type") === "application/xquery";
		});
		var parser = new Fleur.DOMParser();
		var xmldoc;
		var xqeval = function(xexpr) {
			try {
				xmldoc.evaluate(xexpr).then(
					function(res) {},
					function(err) {
						alert(err.toXQuery());
					}
				);
			} catch(e) {
				alert("Exception!\n" + e.stack);
			}
		};
		xmldoc = parser.parseFromString("<dummy/>", "application/xml");
		scripts.forEach(function(sc) {
			xqeval(sc.textContent);
		});
	}, false);
} else if (global) {
	global.fs = require('fs');
	global.http = require('http');
	global.path = require('path');
	global.url = require('url');
	global.os = require('os');
	var startparams = process.argv[1].endsWith('fleur.js') || process.argv[1].endsWith('fleur') ? 2 : 3;
	var params = {argv: []};
	process.argv.forEach(function(val, i) {
		if (i >= startparams) {
			if (!params.q && !params.qs) {
				if (val.startsWith("-q:") && val.length > 3) {
					params.q = val.substr(3);
				} else if (val.startsWith("-qs:") && val.length > 4) {
					params.qs = val.substr(4);
				} else if (val.startsWith("-s:") && !params.s && val.length > 3) {
					params.s = val.substr(3);
				} else if (val.startsWith("-o:") && !params.o && val.length > 3) {
					params.o = val.substr(3);
				} else {
					params.usage = true;
				}
			} else if (params.q || params.qs) {
				params.argv.push(val);
			} else {
				params.usage = true;
			}
		}
	});
	if (params.usage || (!params.qs && !params.q)) {
		process.stdout.write("Usage: node fleur [-s:xmlfile] [-o:outfile] (-q:queryfile|-qs:querystring) [params]\n");
		process.stdout.write(" -s:     XML input file (optional)\n");
		process.stdout.write(" -o:     output file (optional)\n");
		process.stdout.write(" -q:     query file\n");
		process.stdout.write(" -qs:    query string\n");
		process.stdout.write(" params  name=value as externals");
	} else {
		var parseval = function(xml, xexpr, out) {
			var parser = new global.Fleur.DOMParser();
			var xmldoc = parser.parseFromString(xml, "application/xml");
			try {
				xmldoc.evaluate(xexpr).then(
					function(res) {
						if (out) {
	        				global.fs.writeFile(out, res.toXQuery(), function(err) {if (err) process.stdout.write(err);});
						} else {
							process.stdout.write(res.toXQuery());
						}
					},
					function(err) {
						if (out) {
	        				global.fs.writeFile(out, err.toXQuery(), function(err) {if (err) process.stdout.write(err);});
						} else {
							process.stdout.write(err.toXQuery());
						}
					}
				);
			} catch(e) {
				process.stdout.write("Exception!\n" + e.stack);
			}
		};
		Fleur.baseDir = params.q ? global.path.dirname(params.q) : process.cwd();
		var sourceval = function(xml) {
			if (params.qs) {
				parseval(xml, params.qs, params.o);
			} else {
				global.fs.readFile(params.q, 'binary', function(err, file){
					if (err) {
						process.stdout.write(err);
					} else {
						parseval(xml, file, params.o);
					}
				});
			}
		};
		if (params.s) {
			global.fs.readFile(params.s, 'binary', function(err, file){
				if (err) {
					process.stdout.write(err);
				} else {
					sourceval(file);
				}
			});
		} else {
			sourceval("<dummy/>");
		}
	}
}