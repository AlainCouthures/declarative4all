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
	var body, uri, context, newcontext, newuri, headers, filename, newfilename, filestats, contentType, ifmodifiedsince, lastmodified, composed;
	var versionInfo, commentStart, commentEnd;
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
		headers['Last-Modified'] = lastmodified;
		response.writeHead(200, headers);
		response.end(file, 'binary');
		if (newfilename) {
	        fs.writeFile(newfilename, file, err => console.log(err));
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
				newcomponents = descriptor.Components.map(comp => path.join(path.dirname(fname), comp)).concat(components);
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
		if (uri === '/favicon.ico') {
			response.writeHead(404, {'Content-Type': 'text/plain'});
			response.end('404 Not Found');
			return;
		}
		while (uri.endsWith('/')) {
			uri = uri.substr(0, uri.length - 1);
		}
		if (uri === '') {
			response.writeHead(301, {'Location': '/stable/manager/index.xml'});
			response.end();
			return;
		}
		filename = path.join(process.cwd(), uri);
		newcontext = null;
		context = uri.split('/')[1];
		if (context.indexOf('2') !== -1) {
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
			filename = path.join(process.cwd(), 'www' , newuri);
			if (fs.existsSync(filename)) {
				filestats = fs.statSync(filename);
				if (filestats.isDirectory()) {
					response.writeHead(301, {'Location': uri + '/index.' + (fs.existsSync(filename + path.sep + 'index.html') ? 'html' : fs.existsSync(filename + path.sep + '/index.htm') ? 'htm' : 'xml')});
					response.end();
					return;
				}
			}
			newfilename = null;
			if (!fs.existsSync(filename)) {
				filename = filename.split(path.sep);
				filename.splice(filename.length - 4, 2, context);
				filename = filename.join(path.sep);
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
		ifmodifiedsince = request.headers['if-modified-since'];
		if (ifmodifiedsince && (new Date(ifmodifiedsince)).getTime() >= filestats.mtime.getTime()) {
			response.writeHead(304, {'Content-Type': 'text/plain'});
			response.end('304 Not Modified');
			return;
		}
		lastmodified = filestats.mtime.toUTCString();
		fs.readFile(filename, 'binary', sendfile);
	});
}).listen(port);
