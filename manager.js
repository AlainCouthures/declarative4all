/*eslint-env node*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module manager
 * @description  === Manager HTTP Server ===
 * Manager HTTP Server for building apps dynamically
 */
		
global.fs = require('fs');
global.http = require('http');
global.path = require('path');
global.url = require('url');
global.os = require('os');
global.child_process = require('child_process');

var srcname, srcstats;
var composeResponse = function(resp, components, callback) {
	var fname, descriptor, newcomponents;
	if (components.length === 0) {
		resp.cpd = resp.commentStart + '\n' + resp.versionInfo.Licence + '\n' + resp.commentEnd + '\n\n' + resp.cpd;
		Object.keys(resp.versionInfo).map(info => {if (info.startsWith("Version")) resp.cpd = resp.cpd.replace(new RegExp('\\$\\$\\$' + info + '\\$\\$\\$', 'mg'), resp.versionInfo[info]);});
		callback(false, resp.cpd);
		return;
	}
	fname = components.shift();
	if (fname instanceof Array) {
		resp.cpd += fname[0];
		composeResponse(resp, components, callback);
		return;
	}
	global.fs.readFile(fname, 'binary', function(err, file) {
		if (err) {
			callback(err, resp.cpd);
			return;
		}
		if (fname.endsWith(global.path.sep + 'project.json')) {
			var rmcomments = function(json) {
				var state = 0;
				var ret = "";
				for (var i = 0, l = json.length; i < l; i++) {
					var c = json.charAt(i);
					switch (state) {
						case 0:
							if (c === "/") {
								i++;
								c = json.charAt(i);
								if (c === "*") {
									state = 1;
								} else if (c === "/") {
									state = 2;
								} else {
									ret += "/" + c;
								}
							} else {
								if (c === "'") {
									state = 3;
								} else if (c === '"') {
									state = 4;
								}
								ret += c;
							}
							break;
						case 1:
							if (c === "*") {
								i++;
								c = json.charAt(i);
								if (c === "/") {
									state = 0;
								}
							}
							break;
						case 2:
							if (c === "\n") {
								state = 0;
							}
							break;
						case 3:
							ret += c;
							if (c === "'") {
								state = 0;
							}
							break;
						case 4:
							ret += c;
							if (c === '"') {
								state = 0;
							}
							break;
					}
				}
				return ret;
			};
			file = rmcomments(file);
			descriptor = JSON.parse(file);
			if (!resp.versionInfo) {
				resp.versionInfo = descriptor;
			}
			if (descriptor.Header) {
				resp.cpd += descriptor.Header;
			}
			newcomponents = descriptor.Components.map(comp => (typeof comp === 'string') ? global.path.join(global.path.dirname(fname), comp) : comp).concat(components);
			if (descriptor.Footer) {
				newcomponents.push([descriptor.Footer]);
			}
			composeResponse(resp, newcomponents, callback);
			return;
		}
		if (fname.endsWith('.js') || fname.endsWith('.css')) {
			file = file.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/mg,'').replace('"use strict";','').replace(/(\r|\n)+(\s|\r|\n)*(\r|\n)+/mg, '\n');
		} else if (fname.endsWith('.xml')) {
			file = file.replace(/(?:\<\!--(?:[\s\S]*?)--\>)/mg,'').replace(/(\r|\n)+(\s|\r|\n)*(\r|\n)+/mg, '\n');
		}
		resp.cpd += file.replace(/^\n/gm,'').replace(/\n$/gm,'') + '\n';
		composeResponse(resp, components, callback);
	});
};

if (process.argv.length > 2) {
	srcname = process.argv[2];
	if (!srcname.endsWith('.js')) {
		srcname += '.js';
	}
	srcstats = global.fs.statSync(srcname);
	if (srcstats.isDirectory()) {
		composeResponse({cpd: '', commentStart: '/*', commentEnd: '*/'}, [srcname + global.path.sep + 'project.json'], (err, file) => {
			if (err) {
				process.stdout.write(err);
			} else {
				eval(file);
			}
		});
	}
} else {
	const port = 81;
	const contentTypesByExtension = {
		".css":   "text/css",
		".csv":   "text/csv",
		".docx":  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".gif":   "image/gif",
		".htm":   "text/html",
		".html":  "text/html",
		".ico":   "image/x-icon",
		".jpeg":  "image/jpeg",
		".jpg":   "image/jpeg",
		".js":    "application/javascript",
		".json":  "application/json",
		".ofx":   "application/x-ofx",
		".png":   "image/png",
		".svg":   "image/svg+xml",
		".txt":   "text/plain",
		".xhtml": "application/xhtml+xml",
		".xlsx":  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		".xml":   "application/xml;charset=utf-8",
		".xsl":   "text/xsl",
		".zip":   "application/zip"
	};
	global.http.createServer(function(request, response) {
		var body, uri, method, context, newcontext, newuri, headers, filename, filestats, newfilename, isnewfile, putname, contentType, ifmodifiedsince, lastmodified;
		var resp = {cpd: '', commentStart: '/*', commentEnd: '*/'}, upper;
		body = "";
		var sendfile = function(err, file) {
			var Fleur;
			//console.log("sendfile " + filename);
			if (err) {        
				response.writeHead(err.errno === 34 ? 404 : 500, {'Content-Type': 'text/plain'});
				response.end(err.errno === 34 ? '404 Not Found' : '500 Internal server error - ' + err);
				return;
			}
			headers = {};
			contentType = contentTypesByExtension[global.path.extname(filename)];
			//console.log(contentType);
			if (contentType === "application/xhtml+xml") {
				if (global.fs.existsSync('./js/fleur.js')) {
	    			Fleur = require('./js/fleur.js');
	    			contentType = "text/html";
	    			file = Fleur.Serializer.xhtml2html5(file, "js/xsltforms.js", "css/xsltforms.css");
					headers['Content-Type'] = contentType;
					if (lastmodified) {
						headers['Expires'] = lastmodified;
						headers['Last-Modified'] = lastmodified;
					}
					response.writeHead(200, headers);
					response.end(file, 'binary');
					if (newfilename) {
				        global.fs.writeFile(newfilename, file, err => { if (err) console.log(err);});
					}
				} else {
					var moduri = uri.split('/');
					moduri.pop();
					moduri = moduri.join('/') + '/js/fleur.js';
					global.http.get({
						host: 'localhost',
						port: port,
						path: moduri
					}, function(modresp) {
				        var modbody = '';
				        modresp.on('data', function(d) {
				            modbody += d;
				        });
				        modresp.on('end', function() {
				        	var fleursrc = './tmp/fleur.js';
				        	global.fs.writeFile(fleursrc, modbody, err => {
				        		if (err) {
				        			console.log(err);
				        		}
			        			global.fleurmtime = global.fs.statSync(fleursrc).mtime.toISOString();
			        			Fleur = require(fleursrc);
				    			contentType = "text/html";
								//console.log(contentType);
				    			file = Fleur.Serializer.xhtml2html5(file, "js/xsltforms.js", "css/xsltforms.css");
								headers['Content-Type'] = contentType;
								if (lastmodified) {
									headers['Expires'] = lastmodified;
									headers['Last-Modified'] = lastmodified;
								}
								response.writeHead(200, headers);
								response.end(file, 'binary');
								if (newfilename) {
							        global.fs.writeFile(newfilename, file, err => { if (err) console.log(err);});
								}
								delete require.cache[require.resolve(fleursrc)];
				        	});
				        });
					});
				}
			} else {
				if (contentType) {
					headers['Content-Type'] = contentType;
				}
				if (lastmodified) {
					headers['Expires'] = lastmodified;
					headers['Last-Modified'] = lastmodified;
				}
				response.writeHead(200, headers);
				response.end(file, 'binary');
				if (newfilename) {
			        global.fs.writeFile(newfilename, file, err => { if (err) console.log(err);});
				}
			}
		};
		var execfile = function(err, file) {
			var Fleur, doc, reqeval;
			if (err) {        
				response.writeHead(err.errno === 34 ? 404 : 500, {'Content-Type': 'text/plain'});
				response.end(err.errno === 34 ? '404 Not Found' : '500 Internal server error - ' + err);
				return;
			}
			headers = {};
			lastmodified = (new Date()).toUTCString();
			headers['Last-Modified'] = lastmodified;
			if (global.fs.existsSync('./js/fleur.js')) {
    			Fleur = require('./js/fleur.js');
    			doc = new Fleur.Document();
    			reqeval = {request: {headers: request.headers, query: global.url.parse(request.url).query}};
    			if (body !== "") {
    				reqeval.request.body = body;
    			}
				doc.evaluate(file, null, reqeval).then(
					function(res) {
						headers['Content-Type'] = res.mediatype;
						response.writeHead(200, headers);
						response.end(res.serialize(), 'binary');
					},
					function(err) {
						contentType = contentTypesByExtension['.txt'];
						if (contentType) {
							headers['Content-Type'] = contentType;
						}
						response.writeHead(200, headers);
						response.end(err.toXQuery(), 'binary');
					}
				);
			} else {
				var moduri = uri.split('/');
				moduri.pop();
				moduri = moduri.join('/') + '/js/fleur.js';
				global.http.get({
					host: 'localhost',
					port: port,
					path: moduri
				}, function(modresp) {
			        var modbody = '';
			        modresp.on('data', function(d) {
			            modbody += d;
			        });
			        modresp.on('end', function() {
			        	var fleursrc = './tmp/fleur.js';
			        	global.fs.writeFile(fleursrc, modbody, err => {
			        		if (err) {
			        			console.log(err);
			        		}
			        			global.fleurmtime = global.fs.statSync(fleursrc).mtime.toISOString();
			        			Fleur = require(fleursrc);
			        			doc = new Fleur.Document();
    							reqeval = {request: {headers: request.headers, query: global.url.parse(request.url).query}};
				    			if (body !== "") {
				    				reqeval.request.body = body;
				    			}
								//var res = doc.evaluate(file, doc, new Fleur.XPathNSResolver(), Fleur.XPathResult.ANY_TYPE, null).toXQuery();
								doc.evaluate(file, null, reqeval).then(
									function(res) {
										headers['Content-Type'] = res.mediatype;
										response.writeHead(200, headers);
										response.end(res.serialize(), 'binary');
										delete require.cache[require.resolve(fleursrc)];
									},
									function(err) {
										contentType = contentTypesByExtension['.txt'];
										if (contentType) {
											headers['Content-Type'] = contentType;
										}
										response.writeHead(200, headers);
										response.end(err.toXQuery(), 'binary');
										delete require.cache[require.resolve(fleursrc)];
									}
								);
			        		//}
			        	});
			        });
				});
			}
		};
		request.on('data', function (chunk) {
			body += chunk;
		});
		request.on('end', function () {
			uri = global.url.parse(request.url).pathname;
			method = request.method;
			filename = global.path.join(process.cwd(), uri);
			newfilename = null;
			lastmodified = null;
			if (uri === '/back.xml') {
				headers = {};
				headers['Content-Type'] = 'application/xml';
				lastmodified = (new Date()).toUTCString();
				headers['Last-Modified'] = lastmodified;
				response.writeHead(200, headers);
				response.end(decodeURIComponent(body.substr(9).replace(/\+/g, " ")), 'binary');
				return;
			}
			if (uri === '/echo.htm') {
				global.fs.readFile(filename, 'binary', (err, file) => {
					if (err) {
						sendfile(err, file);
					} else {
						file = file.replace('$$$body$$$', body.replace(/</gm, '&lt;').replace(/>/gm, '&gt;'));
						file = file.replace('$$$request$$$', JSON.stringify({
							'httpVersion': request.httpVersion,
							'method': request.method,
							'url': request.url,
							'headers': request.headers,
							'trailers': request.trailers
						}, null, ' '));
						sendfile(err, file);
					}
				});
				return;
			}
			while (uri.endsWith('/')) {
				uri = uri.substr(0, uri.length - 1);
			}
			newuri = uri;
			while (newuri.startsWith('/')) {
				newuri = newuri.substr(1);
			}
			if (uri === '') {
				if (method === 'GET') {
					response.writeHead(301, {'Location': '/stable/manager/index.xml'});
					response.end();
				} else {
					response.writeHead(403, {'Content-Type': 'text/plain'});
					response.end('403 Forbidden');
				}
				return;
			}
			filename = global.path.resolve(process.cwd(), 'public', newuri);
			if (!filename.startsWith(global.path.resolve(process.cwd(), 'public'))) {
				response.writeHead(403, {'Content-Type': 'text/plain'});
				response.end('403 Forbidden');
				//console.log('403 Forbidden');
				return;
			}
			newcontext = null;
			context = uri.split('/')[1];
			if (context.indexOf('2') !== -1) {
				if (method !== 'GET') {
					response.writeHead(403, {'Content-Type': 'text/plain'});
					response.end('403 Forbidden');
					return;
				}
				context = context.split('2');
				newcontext = context[1];
				context = context[0];
				filename = filename.split(global.path.sep);
				filename.splice(filename.length - 3, 1, context);
				filename = filename.join(global.path.sep);
				newfilename = filename.split(global.path.sep);
				if (newcontext === "root") {
					newfilename.splice(newfilename.length - 4, 3);
				} else {
					newfilename.splice(newfilename.length - 4, 2, newcontext);
				}
				newfilename = newfilename.join(global.path.sep);
			}
			if (!global.fs.existsSync(filename)) {
				newuri = uri.split('/');
				newuri.splice(0, 2);
				newuri = newuri.join('/');
				upper = !global.fs.existsSync(global.path.join(process.cwd(), 'public', newuri.split('/')[0]));
				if (!upper) {
					filename = global.path.join(process.cwd(), 'public', newuri);
				} else {
					filename = global.path.join(process.cwd(), '..', newuri);
				}
				if (method === 'PUT') {
					filename = filename.split(global.path.sep);
					putname = filename.pop();
					filename = filename.join(global.path.sep);
				}
				if (global.fs.existsSync(filename)) {
					filestats = global.fs.statSync(filename);
					if (filestats.isDirectory()) {
						if (method === 'GET') {
							response.writeHead(301, {'Location': uri + '/index.' + (global.fs.existsSync(filename + global.path.sep + 'index.html') ? 'html' : global.fs.existsSync(filename + global.path.sep + '/index.htm') ? 'htm' : global.fs.existsSync(filename + global.path.sep + '/index.xqy') ? 'xqy' : 'xml')});
							response.end();
						} else if (method === 'PUT') {
							filename = global.path.join(filename, putname);
							isnewfile = !global.fs.existsSync(filename);
							global.fs.writeFile(filename, body, err => {
								if (err) {
								} else if (isnewfile) {
									response.writeHead(201, {'Content-Type': 'text/plain'});
									response.end('201 Created');
								} else {
									response.writeHead(204, {'Content-Type': 'text/plain'});
									response.end('204 No Content');
								}
							});
						} else {
							response.writeHead(403, {'Content-Type': 'text/plain'});
							response.end('403 Forbidden' + ' method:' + method);
						}
						return;
					}
				}
				//newfilename = null;
				if (!global.fs.existsSync(filename)) {
					if (method !== 'GET') {
						response.writeHead(403, {'Content-Type': 'text/plain'});
						response.end('403 Forbidden' + ' - filename:' + filename);
						return;
					}
					filename = filename.split(global.path.sep);
					if (!upper) {
						filename.splice(filename.length - 4, 2, context);
						filename = filename.join(global.path.sep);
					} else {
						filename = global.path.join(process.cwd(), context, filename[filename.length - 2], filename[filename.length - 1]);
					}
				}
				if (!global.fs.existsSync(filename)) {
					response.writeHead(404, {'Content-Type': 'text/plain'});
					response.end('404 Not Found');
					return;
				}
			}
			filestats = global.fs.statSync(filename);
			if (filestats.isDirectory()) {
				if (!global.fs.existsSync(filename + global.path.sep + 'project.json')) {
					response.writeHead(301, {'Location': uri + '/index.' + (global.fs.existsSync(filename + global.path.sep + 'index.html') ? 'html' : global.fs.existsSync(filename + global.path.sep + 'index.htm') ? 'htm' : 'xml')});
					response.end();
					return;
				}
				lastmodified = (new Date()).toUTCString();
				resp.cpd = '';
				resp.versionInfo = null;
				if (filename.endsWith('.js') || filename.endsWith('.css')) {
					resp.commentStart = '/*';
					resp.commentEnd = '*/';
				} else if (filename.endsWith('.xsl')) {
					resp.commentStart = '<!--';
					resp.commentEnd = '-->';
				}
				composeResponse(resp, [filename + global.path.sep + 'project.json'], sendfile);
				return;
			}
			switch(method) {
				case 'GET':
					if (filename.endsWith('.xqy')) {
						global.fs.readFile(filename, 'binary', execfile);
					} else {
						ifmodifiedsince = request.headers['if-modified-since'];
						if (ifmodifiedsince && (new Date(ifmodifiedsince)).getTime() >= (new Date(filestats.mtime.toUTCString())).getTime()) {
							response.writeHead(304, {'Content-Type': 'text/plain'});
							response.end('304 Not Modified');
							return;
						}
						lastmodified = filestats.mtime.toUTCString();
						global.fs.readFile(filename, 'binary', sendfile);
					}
					break;
				case 'PUT':
				case 'POST':
					if (filename.endsWith('.xqy')) {
						global.fs.readFile(filename, 'binary', execfile);
					} else {
						response.writeHead(405, {'Content-Type': 'text/plain'});
						response.end('405 Method Not Allowed');
					}
					break;
				default:
					response.writeHead(405, {'Content-Type': 'text/plain'});
					response.end('405 Method Not Allowed');
			}
		});
	}).listen(port);
}