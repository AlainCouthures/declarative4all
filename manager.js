/*eslint-env node*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module manager
 * @description  === Manager HTTP Server ===
 * Manager HTTP Server for building apps dynamically
 */
		
var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');
//var child_process = require('child_process');

const port = 81;
const contentTypesByExtension = {
	'.css':  'text/css',
	'.csv':  'text/csv',
	'.gif':  'image/gif',
	'.htm':  'text/html',
	'.html': 'text/html',
	'.ico':  'image/vnd.microsoft.icon',
	'.jpeg': 'image/jpeg',
	'.jpg':  'image/jpeg',
	'.js':   'application/javascript',
	'.json': 'application/json',
	'.png':  'image/png',
	'.svg':  'image/svg+xml',
	'.xml':  'application/xml; charset=utf-8',
	'.xsl':  'text/xsl'
};

http.createServer(function(request, response) {
	var body, uri, method, context, newcontext, newuri, headers, filename, newfilename, isnewfile, putname, filestats, contentType, ifmodifiedsince, lastmodified, composed;
	var versionInfo, commentStart, commentEnd, upper;
	body = "";
	var sendfile = function(err, file) {
		if (err) {        
			response.writeHead(err.errno === 34 ? 404 : 500, {'Content-Type': 'text/plain'});
			response.end(err.errno === 34 ? '404 Not Found' : '500 Internal server error - ' + err);
			return;
		}
		headers = {};
		contentType = contentTypesByExtension[path.extname(filename)];
		if (contentType) {
			headers['Content-Type'] = contentType;
		}
		if (lastmodified) {
			headers['Last-Modified'] = lastmodified;
		}
		response.writeHead(200, headers);
		response.end(file, 'binary');
		if (newfilename) {
	        fs.writeFile(newfilename, file, err => { if (err) console.log(err);});
		}
	};
	var composeResponse = function(components) {
		var fname, descriptor, newcomponents;
		if (components.length === 0) {
			composed = commentStart + '\n' + versionInfo.Licence + '\n' + commentEnd + '\n\n' + composed;
			Object.keys(versionInfo).map(info => {if (info.startsWith("Version")) composed = composed.replace(new RegExp('\\$\\$\\$' + info + '\\$\\$\\$', 'mg'), versionInfo[info]);});
			sendfile(false, composed);
			return;
		}
		fname = components.shift();
		if (fname instanceof Array) {
			composed += fname[0];
			composeResponse(components);
			return;
		}
		fs.readFile(fname, 'binary', function(err, file) {
			if (err) {
				sendfile(err, composed);
				return;
			}
			if (fname.endsWith(path.sep + 'project.json')) {
				descriptor = JSON.parse(file);
				if (!versionInfo) {
					versionInfo = descriptor;
				}
				if (descriptor.Header) {
					composed += descriptor.Header;
				}
				newcomponents = descriptor.Components.map(comp => (typeof comp === 'string') ? path.join(path.dirname(fname), comp) : comp).concat(components);
				if (descriptor.Footer) {
					newcomponents.push([descriptor.Footer]);
				}
				composeResponse(newcomponents);
				return;
			}
			if (fname.endsWith('.js') || fname.endsWith('.css')) {
				file = file.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/mg,'').replace('"use strict";','').replace(/(\r|\n)+(\s|\r|\n)*(\r|\n)+/mg, '\n');
			} else if (fname.endsWith('.xml')) {
				file = file.replace(/(?:\<\!--(?:[\s\S]*?)--\>)/mg,'').replace(/(\r|\n)+(\s|\r|\n)*(\r|\n)+/mg, '\n');
			}
			composed += file.replace(/^\n/gm,'').replace(/\n$/gm,'') + '\n';
			composeResponse(components);
		});
	};
	request.on('data', function (chunk) {
		body += chunk;
	});
	request.on('end', function () {
		uri = url.parse(request.url).pathname;
		method = request.method;
		filename = path.join(process.cwd(), uri);
		newfilename = null;
		lastmodified = null;
		if (uri === '/favicon.ico') {
			fs.readFile(filename, 'binary', sendfile);
			return;
		}
		if (uri === '/echo.htm') {
			fs.readFile(filename, 'binary', (err, file) => {
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
		filename = path.join(process.cwd(), uri);
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
			filename = filename.split(path.sep);
			filename.splice(filename.length - 3, 1, context);
			filename = filename.join(path.sep);
			newfilename = filename.split(path.sep);
			newfilename.splice(newfilename.length - 3, 1, newcontext);
			newfilename = newfilename.join(path.sep);
		}
		if (!fs.existsSync(filename)) {
			newuri = uri.split('/');
			newuri.splice(0, 2);
			newuri = newuri.join('/');
			upper = !fs.existsSync(path.join(process.cwd(), 'www', newuri.split('/')[0]));
			if (!upper) {
				filename = path.join(process.cwd(), 'www', newuri);
			} else {
				filename = path.join(process.cwd(), '..', newuri);
			}
			if (method === 'PUT') {
				filename = filename.split(path.sep);
				putname = filename.pop();
				filename = filename.join(path.sep);
			}
			if (fs.existsSync(filename)) {
				filestats = fs.statSync(filename);
				if (filestats.isDirectory()) {
					if (method === 'GET') {
						response.writeHead(301, {'Location': uri + '/index.' + (fs.existsSync(filename + path.sep + 'index.html') ? 'html' : fs.existsSync(filename + path.sep + '/index.htm') ? 'htm' : 'xml')});
						response.end();
					} else if (method === 'PUT') {
						filename = path.join(filename, putname);
						isnewfile = !fs.existsSync(filename);
						fs.writeFile(filename, body, err => {
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
			newfilename = null;
			if (!fs.existsSync(filename)) {
				if (method !== 'GET') {
					response.writeHead(403, {'Content-Type': 'text/plain'});
					response.end('403 Forbidden' + ' - filename:' + filename);
					return;
				}
				filename = filename.split(path.sep);
				if (!upper) {
					filename.splice(filename.length - 4, 2, context);
					filename = filename.join(path.sep);
				} else {
					filename = path.join(process.cwd(), context, filename[filename.length - 2], filename[filename.length - 1]);
				}
			}
			if (!fs.existsSync(filename)) {
				response.writeHead(404, {'Content-Type': 'text/plain'});
				response.end('404 Not Found');
				return;
			}
		}
		filestats = fs.statSync(filename);
		if (filestats.isDirectory()) {
			if (!fs.existsSync(filename + path.sep + 'project.json')) {
				response.writeHead(301, {'Location': uri + '/index.' + (fs.existsSync(filename + path.sep + 'index.html') ? 'html' : fs.existsSync(filename + path.sep + '/index.htm') ? 'htm' : 'xml')});
				response.end();
				return;
			}
			lastmodified = (new Date()).toUTCString();
			composed = "";
			versionInfo = null;
			if (filename.endsWith('.js') || filename.endsWith('.css')) {
				commentStart = '/*';
				commentEnd = '*/';
			} else if (filename.endsWith('.xsl')) {
				commentStart = '<!--';
				commentEnd = '-->';
			}
			composeResponse([filename + path.sep + 'project.json']);
			return;
		}
		switch(method) {
			case 'GET':
				ifmodifiedsince = request.headers['if-modified-since'];
				if (ifmodifiedsince && (new Date(ifmodifiedsince)).getTime() >= filestats.mtime.getTime()) {
					response.writeHead(304, {'Content-Type': 'text/plain'});
					response.end('304 Not Modified');
					return;
				}
				lastmodified = filestats.mtime.toUTCString();
				fs.readFile(filename, 'binary', sendfile);
				break;
			default:
				response.writeHead(405, {'Content-Type': 'text/plain'});
				response.end('405 Method Not Allowed');
		}
	});
}).listen(port);
