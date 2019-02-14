/*eslint-env browser*/
/*globals Fleur XsltForms_xmlevents XsltForms_globals*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 */

Array.prototype.asyncForEach = async function (fn) {
  for (let i = 0; i < this.length; i++) {
    await fn(this[i], i);
  }
};
var parser = new Fleur.DOMParser();
Fleur.noErrorMessage = true;
var globdocs = {};
var jsenv = {};
function getfile(filename) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open('GET', 'data/' + filename, true);
		req.onload = function() {
			if (req.status === 200) {
				resolve(req.responseText);
			} else {
				reject('data/' + filename + ' not loaded!');
	      	}
		};
		req.send(null);
	});
}
function loadenv() {
	document.getElementById('main').getInstanceDocument('catalog').getElementsByTagName('environment').forEach(function(env) {
		var jse = jsenv[env.getAttribute('name')] = {
			node: env,
			folder: '',
			files: []
		};
		env.getElementsByTagName('source').forEach(function(src) {
			if (src.getAttribute('role') !== '') {
				var fname = src.getAttribute('file');
				jse.files.push(fname);
			}
		});
	});
}
var jstests = [];
function envserialize(index) {
	var serializer = new Fleur.Serializer();
	return jstests[index - 1].env ? serializer.serializeToString(jstests[index - 1].env, "application/xml") : "";
}
function testfolder(index) {
	return jstests[index - 1].folder || "";
}
function testfiles(index) {
	return jstests[index - 1].files.join("|");
}
var confeval = async function(t, resolve, reject) {
	var evenv = {};
	evenv.varresolver = new Fleur.varMgr();
	var nss = [];
	var ser = '<dummy/>';
	if (t.env) {
		await t.env.children.asyncForEach(async function(elt) {
			switch(elt.nodeName) {
				case 'source':
					var r = elt.getAttribute('role');
					if (r === '.') {
						ser = globdocs[t.folder + elt.getAttribute('file')];
					} else if (r.charAt(0) === '$') {
						evenv.varresolver.set(null, '', r.substr(1), parser.parseFromString(globdocs[t.folder + elt.getAttribute('file')], "application/xml"));
					}
					break;
				case 'param':
					var n = elt.getAttribute('name');
					var select = elt.getAttribute('select');
					var emptydoc = new Fleur.Document();
					var pvalue = await emptydoc.evaluate(select);
					evenv.varresolver.set(null, '', n, pvalue._result);
					break;
				case 'namespace':
					nss.push([elt.getAttribute('prefix'), elt.getAttribute('uri')]);
					break;
				case 'schema':
					break;
			}
		});
	}
    var xmldoc = parser.parseFromString(ser, "application/xml");
    if (nss.length !== 0) {
		var nsResolver = function(element) {
			return {
				defaultNamespace: element.getAttribute("xmlns"),
				nsresolver: element.ownerDocument.createNSResolver(element),
				lookupNamespaceURI: function(prefix) {
					if (prefix === "_") {
						return this.defaultNamespace;
					}
					return this.nsresolver.lookupNamespaceURI(prefix);
				},
				declareNamespace: function(prefix, uri) {
					return this.nsresolver.declareNamespace(prefix, uri);
				}
			};
		};
		evenv.nsresolver = nsResolver(xmldoc.documentElement);
	    nss.forEach(function(ns) {
	    	if (ns[0] === "") {
	    		evenv.nsresolver.defaultNamespace = ns[1];
    		} else {
		    	evenv.nsresolver.declareNamespace(ns[0], ns[1]);
		    }
	    });
    }
    xmldoc.evaluate(t.expression, null, evenv).then(function(res) {
    	resolve(res, t.name);
    }, function(err) {
    	reject(err, t.name);
    });
};
function readytests(resolve, reject) {
	jstests.forEach(function(t) {
		if (!t.started) {
			if (t.files.every(function(f) {
				return globdocs[f] !== '';
			})) {
				t.started = true;
				confeval(t, resolve, reject);
			}
		}
	});
}
function getloop(resolve, reject) {
	readytests(resolve, reject);
    Object.keys(globdocs).forEach(function(d) {
    	if (globdocs[d] === '') {
    		getfile(d).then(
				function(xmlBuf) {
					globdocs[d] = xmlBuf;
					readytests(resolve, reject);
				},
				function(s) {
					alert(s);
				}
			);
    	}
    });
}
function runtests() {
    var ts = document.getElementById('main').getInstanceDocument('test-set');
    var selected = document.getElementById('main').getInstanceDocument('selected').textContent.split('/')[0];
    var jstenv = {};
    ts.getElementsByTagName('environment').forEach(function(env) {
		var jste = jstenv[env.getAttribute('name')] = {
			node: env,
			folder: selected + '/',
			files: []
		};
		env.getElementsByTagName('source').forEach(function(src) {
			if (src.getAttribute('role') !== '') {
				var fname = src.getAttribute('file');
				jste.files.push(selected + '/' + fname);
			}
		});
	});
	jstests = [];
    ts.getElementsByTagName('test-case').forEach(function(t) {
    	var jst = {
    		name: t.getAttribute('name'),
    		expression: t.getElementsByTagName('test')[0].textContent,
    		files: []
    	};
    	var e = t.getElementsByTagName('environment');
    	if (e[0]) {
    		var eref = e[0].getAttribute('ref');
    		if (eref !== "") {
	    		if (jstenv[eref]) {
	    			jst.env = jstenv[eref].node;
	    			jst.files = jstenv[eref].files;
	    			jst.folder = jstenv[eref].folder;
	    		} else if (jsenv[eref]) {
	    			jst.env = jsenv[eref].node;
	    			jst.files = jsenv[eref].files;
	    			jst.folder = jsenv[eref].folder;
	    		}
    		} else {
    			jst.env = e[0];
    		}
    		jst.files.forEach(function(f) {
    			if (!globdocs[f]) {
					globdocs[f] = '';
				}
			});
		}
    	jstests.push(jst);
    });
	getloop(function(res, testname) {
    	XsltForms_xmlevents.dispatch(XsltForms_globals.defaultModel, "evaluate-response", null, null, null, null, {
			testname: testname,
			result: res.toXQuery()
		});
	}, function(err, testname) {
    	XsltForms_xmlevents.dispatch(XsltForms_globals.defaultModel, "evaluate-response", null, null, null, null, {
			testname: testname,
			result: err
		});
	});
}
function initialize() {
	var testcase = {};
	window.location.search.substr(1).split("&").reduce(function(result, param) {
    var item = param.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
		return result;
  	}, testcase);
	if (testcase.files) {
		testcase.files = testcase.files.split("|");
		testcase.files.forEach(function(f) {
			globdocs[f] = "";
		});
	} else {
		testcase.files = [];
	}
	testcase.env = parser.parseFromString(testcase.env, "application/xml").documentElement;
	testcase.started = true;
	document.getElementById("expression").value = testcase.expression;
	testcase.initexpression = testcase.expression;
	document.getElementById("resultstring").innerHTML = "Expected:  " + testcase.resultstring.replace(/</mg, "&lt;");
	document.getElementById("run").disabled = false;
  	jstests.push(testcase);
	getloop();
}
function run() {
	jstests[0].started = false;
	try {
		var jsret = Fleur.XPathEvaluator._xq2js(document.getElementById("expression").value);
		var arr;
		eval("arr = " + jsret + ";");
		var doc = parser.parseFromArray([Fleur.XQueryXNames, [arr]]);
		var ser = new Fleur.XMLSerializer();
		document.getElementById("xqueryx").innerHTML = ser.serializeToString(doc, true).replace(/&/mg, "&amp;").replace(/</mg, "&lt;");
		document.getElementById("xqueryarr").innerHTML = jsret.replace(/&/mg, "&amp;").replace(/</mg, "&lt;");
	} catch(e) {
		document.getElementById("xqueryx").innerHTML = "Exception!\n" + e.message + "\n\n" + jsret;
	}
	jstests[0].expression = document.getElementById("expression").value;
	document.getElementById("resultstring").style.visibility = jstests[0].expression === jstests[0].initexpression ? "visible" : "hidden";
	readytests(function(res) {
		var now = new Date();
		var snow = ((now.getHours() < 10)?"0":"") + now.getHours() +":"+ ((now.getMinutes() < 10)?"0":"") + now.getMinutes() +":"+ ((now.getSeconds() < 10)?"0":"") + now.getSeconds();
		document.getElementById("effectiveresult").innerHTML = snow + " - " + res.toXQuery().replace(/&/mg, "&amp;").replace(/</mg, "&lt;");
	}, function(err) {
		var now = new Date();
		var snow = ((now.getHours() < 10)?"0":"") + now.getHours() +":"+ ((now.getMinutes() < 10)?"0":"") + now.getMinutes() +":"+ ((now.getSeconds() < 10)?"0":"") + now.getSeconds();
		document.getElementById("effectiveresult").innerHTML = snow + " - Exception!\n" + err.stack;
	});
}