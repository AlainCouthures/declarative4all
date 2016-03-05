/*eslint-env browser*/
/*globals XsltForms_browser zip_inflate idRef XsltForms_xpath Fleur XsltForms_repeat XsltForms_xmlevents XsltForms_listener XsltForms_idManager XsltForms_schema XsltForms_calendar XsltForms_typeDefs $$$VersionNumber$$$*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module engine
 * @description  === "XsltForms_engine" class ===
 * Global class for XSLTForms Management
 */
var XsltForms_engine = {

	fileVersion: "$$$VersionName$$$",
	fileVersionNumber: $$$VersionNumber$$$,
	conf: {
		debug: "false",
		xsltengine: "",
		lang: "navigator",
		loadingmsg: "... Loading ...",
		valuesseparator: " "
	},
	debugMode: false,
	debugButtons: [
		{label: "Profiler", name: "profiler"}
		,{label: "Trace Log", name: "tracelog"}
		/*
		,{label: "Validator"},
		,{label: "XPath Evaluator"}
		*/
	],
	cont : 0,
	ready : false,
	body : null,
	models : [],
	changes : [],
	newChanges : [],
	building : false,
	posibleBlur : false,
	bindErrMsgs : [],		// binding-error messages gathered during refreshing
	transformtime: "unknown",
	htmltime: 0,
	creatingtime: 0,
	inittime: 0,
	refreshtime: 0,
	refreshcount: 0,
	validationError: true,
	counters: {
		component: 0,
		group: 0,
		input: 0,
		item: 0,
		itemset: 0,
		label: 0,
		output: 0,
		repeat: 0,
		select: 0,
		trigger: 0,
		upload: 0,
		xvar: 0
	},
	nbsubforms: 0,
	componentLoads: [],
	jslibraries: {},
	htmlversion: "4",

		
/**
 * * '''debugging''' method : toggles debug mode
 */

	debugging : function() {
		if (document.documentElement.childNodes[0].nodeType === 8 || (XsltForms_browser.isIE && document.documentElement.childNodes[0].childNodes[1] && document.documentElement.childNodes[0].childNodes[1].nodeType === 8)) {
			var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
			if (this.debugMode) {
				var dbg = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "div") : document.createElement("div");
				dbg.setAttribute("style", "border-bottom: thin solid #888888;");
				dbg.setAttribute("id", "xsltforms_debug");
				var img = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
				img.setAttribute("src", XsltForms_browser.imgROOT+"magnify.png");
				img.setAttribute("style", "vertical-align:middle;border:0;");
				dbg.appendChild(img);
				var spn = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
				spn.setAttribute("style", "font-size:16pt");
				var txt = document.createTextNode(" Debug Mode");
				spn.appendChild(txt);
				dbg.appendChild(spn);
				var spn2 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
				spn2.setAttribute("style", "font-size:11pt");
				var txt2 = document.createTextNode(" ("+this.fileVersion+") \xA0\xA0\xA0");
				spn2.appendChild(txt2);
				dbg.appendChild(spn2);
				var a = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "a") : document.createElement("a");
				a.setAttribute("href", "http://www.w3.org/TR/xforms11/");
				a.setAttribute("style", "text-decoration:none;");
				var img2 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
				img2.setAttribute("src", XsltForms_browser.imgROOT+"valid-xforms11.png");
				img2.setAttribute("style", "vertical-align:middle;border:0;");
				a.appendChild(img2);
				dbg.appendChild(a);
				var a2 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "a") : document.createElement("a");
				a2.setAttribute("href", "http://www.agencexml.com/xsltforms");
				a2.setAttribute("style", "text-decoration:none;");
				var img3 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
				img3.setAttribute("src", XsltForms_browser.imgROOT+"poweredbyXSLTForms.png");
				img3.setAttribute("style", "vertical-align:middle;border:0;");
				a2.appendChild(img3);
				dbg.appendChild(a2);
				var spn3 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
				spn3.setAttribute("style", "font-size:11pt");
				var txt3 = document.createTextNode(" Press ");
				spn3.appendChild(txt3);
				dbg.appendChild(spn3);
				var a3 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "a") : document.createElement("a");
				a3.setAttribute("onClick", "XsltForms_engine.debugMode=false;XsltForms_engine.debugModeging();return false;");
				a3.setAttribute("style", "text-decoration:none;");
				a3.setAttribute("href", "#");
				var img4 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
				img4.setAttribute("src", XsltForms_browser.imgROOT+"F1.png");
				img4.setAttribute("style", "vertical-align:middle;border:0;");
				a3.appendChild(img4);
				dbg.appendChild(a3);
				var spn4 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
				spn4.setAttribute("style", "font-size:11pt");
				var txt4 = document.createTextNode(" to toggle mode ");
				spn4.appendChild(txt4);
				dbg.appendChild(spn4);
				var br = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "br") : document.createElement("br");
				dbg.appendChild(br);
				var txt5 = document.createTextNode(" \xA0\xA0\xA0\xA0\xA0\xA0");
				dbg.appendChild(txt5);
				for (var i = 0, len = XsltForms_engine.debugButtons.length; i < len; i++) {
					if (XsltForms_engine.debugButtons[i].name) {
						var btn = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "button") : document.createElement("button");
						btn.setAttribute("type", "button");
						btn.setAttribute("onClick", "XsltForms_engine.opentab('" + XsltForms_engine.debugButtons[i].name + "');");
						var txt6 = document.createTextNode(" "+XsltForms_engine.debugButtons[i].label+" ");
						btn.appendChild(txt6);
						dbg.appendChild(btn);
					} else {
						var a4 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "a") : document.createElement("a");
						a4.setAttribute("href", "http://www.agencexml.com/xsltforms");
						var txt7 = document.createTextNode(" Debugging extensions can be downloaded! ");
						a4.appendChild(txt7);
						dbg.appendChild(a4);
						break;
					}
				}
				var br2 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "br") : document.createElement("br");
				dbg.appendChild(br2);
				var ifr = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "iframe") : document.createElement("iframe");
				ifr.setAttribute("src", "http://www.agencexml.com/direct/banner.htm");
				ifr.setAttribute("style", "width:100%;height:90px;border:none;margin:0;");
				ifr.setAttribute("frameborder", "0");
				var ids_seen = {};
				var nodes6 = document.getElementsByTagName('*');
				for (var i6 = 0, l6 = nodes6.length; i6 < l6; i6++) {
					var node6 = nodes6[i6];
					if (node6.id) {
						var id6 = node6.id;
						ids_seen[id6] = ids_seen[id6] ? ids_seen[id6]+1 : 1;
					}
				}
				var s6 = "";
				for (var id6b in ids_seen) {
					if (ids_seen[id6b] > 1) {
						s6 += id6b + " ";
					}
				}
				if (s6 !== "") {
					var txt6b = document.createTextNode("WARNING: Duplicate ids: " + s6);
					var spn6 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
					spn6.setAttribute("style", "color:red; font-size: 22pt");
					spn6.appendChild(txt6b);
					dbg.appendChild(spn6);
				}
				dbg.appendChild(ifr);
				body.insertBefore(dbg, body.firstChild);
				if (!document.getElementById("xsltforms_console")) {
					var conselt = document.createElement("div");
					conselt.setAttribute("id", "xsltforms_console");
					document.body.appendChild(conselt);
				}
				document.getElementById("xsltforms_console").style.display = "block";
			} else {
				body.removeChild(document.getElementById("xsltforms_debug"));
				document.getElementById("xsltforms_console").style.display = "none";
			}
		}
	},

		
/**
 * * '''xmlrequest''' method : runs an xmlrequest 
 */

	xmlrequest : function(method, resource, ser) {
		if (typeof method !== "string") {
			return '<error xmlns="">Invalid method "'+method+'"</error>';
		}
		method = method.toLowerCase();
		var instance, modid;
		switch (method) {
			case "get":
				switch (resource) {
					case "xsltforms-profiler":
						return XsltForms_engine.profiling_data();
					case "xsltforms-tracelog":
						try  {
							return XsltForms_browser.saveDoc(XsltForms_browser.debugConsole.doc_, "application/xml", true);
						} catch (e) {
							XsltForms_browser.debugConsole.write("ERROR: Could not open xsltforms-tracelog " + e.message);
							return '<error xmlns="">Could not open xsltforms-tracelog "'+e.message+'"</error>';
						}
						break;
					default:
						var slash = resource.indexOf("/");
						if (slash === -1 ) {
							instance = document.getElementById(resource);
							if (!instance) {
								return '<error xmlns="">Unknown resource "'+resource+'" for method "'+method+'"</error>';
							}
							return XsltForms_browser.saveDoc(instance.xfElement.doc, "application/xml", true);
						} else {
							var filename = resource.substr(slash+1);
							instance = document.getElementById(resource.substr(0, slash));
							if (!instance) {
								return '<error xmlns="">Unknown resource "'+resource+'" for method "'+method+'"</error>';
							}
							var f = instance.xfElement.archive[filename];
							if (!f) {
								return '<error xmlns="">Unknown resource "'+resource+'" for method "'+method+'"</error>';
							}
							if (!f.doc) {
								f.doc = XsltForms_browser.createXMLDocument("<dummy/>");
								modid = XsltForms_browser.getDocMeta(instance.xfElement.doc, "model");
								XsltForms_browser.loadDoc(f.doc, XsltForms_browser.utf8decode(zip_inflate(f.compressedFileData)));
								XsltForms_browser.setDocMeta(f.doc, "instance", idRef);
								XsltForms_browser.setDocMeta(f.doc, "model", modid);
							}
							return XsltForms_browser.saveDoc(f.doc, "application/xml", true);
						}
				}
				break;
			case "put":
				instance = document.getElementById(resource);
				if (!instance) {
					return '<error xmlns="">Unknown resource "'+resource+'" for method "'+method+'"</error>';
				}
				instance.xfElement.setDoc(ser, false, true);
				modid = XsltForms_browser.getDocMeta(instance.xfElement.doc, "model");
				XsltForms_engine.addChange(modid);
				XsltForms_engine.closeChanges();
				return '<ok xmlns=""/>';
			default:
				return '<error xmlns="">Unknown method "'+method+'"</error>';
		}
	},

		
/**
 * * '''profiling_data''' method : displays time statistics
 */

	profiling_data : function() {
		var s = '<xsltforms:dump xmlns:xsltforms="http://www.agencexml.com/xsltforms">';
		s += '<xsltforms:date>' + XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddThh:mm:ssz", true) + '</xsltforms:date>';
		s += '<xsltforms:location>' + XsltForms_browser.escape(window.location.href) + '</xsltforms:location>';
		s += '<xsltforms:appcodename>' + navigator.appCodeName + '</xsltforms:appcodename>';
		s += '<xsltforms:appname>' + navigator.appName + '</xsltforms:appname>';
		s += '<xsltforms:appversion>' + navigator.appVersion + '</xsltforms:appversion>';
		s += '<xsltforms:platform>' + navigator.platform + '</xsltforms:platform>';
		s += '<xsltforms:useragent>' + navigator.userAgent + '</xsltforms:useragent>';
		s += '<xsltforms:xsltengine>' + this.xsltEngine + '</xsltforms:xsltengine>';
		var xsltsrc = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt">';
		xsltsrc += '	<xsl:output method="xml"/>';
		xsltsrc += '	<xsl:template match="/">';
		xsltsrc += '		<xsl:variable name="version">';
		xsltsrc += '			<xsl:if test="system-property(\'xsl:vendor\')=\'Microsoft\'">';
		xsltsrc += '				<xsl:value-of select="system-property(\'msxsl:version\')"/>';
		xsltsrc += '			</xsl:if>';
		xsltsrc += '		</xsl:variable>';
		xsltsrc += '		<properties><xsl:value-of select="concat(\'|\',system-property(\'xsl:vendor\'),\' \',system-property(\'xsl:vendor-url\'),\' \',$version,\'|\')"/></properties>';
		xsltsrc += '	</xsl:template>';
		xsltsrc += '</xsl:stylesheet>';
		var res = XsltForms_browser.transformText("<dummy/>", xsltsrc, true);
		var spres = res.split("|");
		s += '<xsltforms:xsltengine2>' + spres[1] + '</xsltforms:xsltengine2>';
		s += '<xsltforms:version>' + this.fileVersion + '</xsltforms:version>';
		s += '<xsltforms:instances>';
		var pos = 0;
		for (var m = 0, mlen = XsltForms_engine.models.length; m < mlen; m++) {
			if (XsltForms_engine.models[m].element.id !== XsltForms_browser.idPf + "model-config") {
				for (var id in XsltForms_engine.models[m].instances) {
					if (XsltForms_engine.models[m].instances.hasOwnProperty(id)) {
						var count = XsltForms_browser.selectNodesLength("descendant::node() | descendant::*/@*[not(starts-with(local-name(),'xsltforms_'))]", XsltForms_engine.models[m].instances[id].doc);
						s += '<xsltforms:instance id="' + id + '">' + count + '</xsltforms:instance>';
						if (XsltForms_engine.models[m].instances[id].archive) {
							for (var fn in XsltForms_engine.models[m].instances[id].archive) {
								if (XsltForms_engine.models[m].instances[id].archive.hasOwnProperty(fn)) {
									if (!XsltForms_engine.models[m].instances[id].archive[fn].doc) {
										XsltForms_engine.models[m].instances[id].archive[fn].doc = XsltForms_browser.createXMLDocument("<dummy/>");
										XsltForms_browser.loadDoc(XsltForms_engine.models[m].instances[id].archive[fn].doc, XsltForms_browser.utf8decode(zip_inflate(XsltForms_engine.models[m].instances[id].archive[fn].compressedFileData)));
										XsltForms_browser.setDocMeta(XsltForms_engine.models[m].instances[id].archive[fn].doc, "instance", id);
										XsltForms_browser.setDocMeta(XsltForms_engine.models[m].instances[id].archive[fn].doc, "model", m);
									}
									count = XsltForms_browser.selectNodesLength("descendant::node() | descendant::*/@*[not(starts-with(local-name(),'xsltforms_'))]", XsltForms_engine.models[m].instances[id].archive[fn].doc);
									s += '<xsltforms:instance id="' + id + '/' + fn + '">' + count + '</xsltforms:instance>';
								}
							}
						}
						pos++;
					}
				}
			}
		}
		s += '</xsltforms:instances>';
		s += '<xsltforms:controls>';
		s += '<xsltforms:control type="group">' + XsltForms_engine.counters.group + '</xsltforms:control>';
		s += '<xsltforms:control type="input">' + XsltForms_engine.counters.input + '</xsltforms:control>';
		s += '<xsltforms:control type="item">' + XsltForms_engine.counters.item + '</xsltforms:control>';
		s += '<xsltforms:control type="itemset">' + XsltForms_engine.counters.itemset + '</xsltforms:control>';
		s += '<xsltforms:control type="output">' + XsltForms_engine.counters.output + '</xsltforms:control>';
		s += '<xsltforms:control type="repeat">' + XsltForms_engine.counters.repeat + '</xsltforms:control>';
		s += '<xsltforms:control type="select">' + XsltForms_engine.counters.select + '</xsltforms:control>';
		s += '<xsltforms:control type="trigger">' + XsltForms_engine.counters.trigger + '</xsltforms:control>';
		s += '</xsltforms:controls>';
		var re = /<\w/g;
		var hc = 0;
		var bhtml = document.documentElement.innerHTML;
		while (re.exec(bhtml)) {
			hc++;
		}
		s += '<xsltforms:htmlelements>' + hc + '</xsltforms:htmlelements>';
		s += '<xsltforms:transformtime>' + this.transformtime + '</xsltforms:transformtime>';
		s += '<xsltforms:htmltime>' + this.htmltime + '</xsltforms:htmltime>';
		s += '<xsltforms:creatingtime>' + this.creatingtime + '</xsltforms:creatingtime>';
		s += '<xsltforms:inittime>' + this.inittime + '</xsltforms:inittime>';
		s += '<xsltforms:refreshcount>' + this.refreshcount + '</xsltforms:refreshcount>';
		s += '<xsltforms:refreshtime>' + this.refreshtime + '</xsltforms:refreshtime>';
		var exprtab = [];
		for (var expr in XsltForms_xpath.expressions) {
			if (XsltForms_xpath.expressions.hasOwnProperty(expr) && XsltForms_xpath.expressions[expr]) {
				exprtab[exprtab.length] = {expr: expr, evaltime: XsltForms_xpath.expressions[expr].evaltime};
			}
		}
		exprtab.sort(function(a,b) { return b.evaltime - a.evaltime; });
		var topt = 0;
		s += '<xsltforms:xpaths>';
		if (exprtab.length > 0) {
			for (var i = 0; i < exprtab.length && i < 20; i++) {
				s += '<xsltforms:xpath expr="' + XsltForms_browser.escape(exprtab[i].expr).replace(/\"/g, "&quot;") + '">' + exprtab[i].evaltime + '</xsltforms:xpath>';
				topt += exprtab[i].evaltime;
			}
			if (exprtab.length > 20) {
				var others = 0;
				for (var j = 20; j < exprtab.length; j++) {
					others += exprtab[j].evaltime;
				}
				s += '<xsltforms:others count="' + (exprtab.length - 20) + '">' + others + '</xsltforms:others>';
				topt += others;
			}
			s += '<xsltforms:total>' + topt + '</xsltforms:total>';
		}
		s += '</xsltforms:xpaths>';
		s += '</xsltforms:dump>';
		return s;
	},

		
/**
 * * '''opentab''' method : open a new tab for debug purposes
 */

	opentab : function(tabname) {
		var req = XsltForms_browser.openRequest("GET", XsltForms_browser.debugModeROOT + "xsltforms_" + tabname + (XsltForms_browser.debugModeROOT === XsltForms_browser.ROOT ? ".xhtml" : ".xml"), false);
		if (req.overrideMimeType) {
			req.overrideMimeType("application/xml");
		}
		try {        
			req.send(null);
		} catch(e) {
			alert("File not found: " + XsltForms_browser.debugModeROOT + "xsltforms_" + tabname + (XsltForms_browser.debugModeROOT === XsltForms_browser.ROOT ? ".xhtml" : ".xml"));
		}
		if (req.status === 200 || req.status === 0) {
			var s = "";
			try {
				s = XsltForms_browser.transformText(req.responseText, XsltForms_browser.xslROOT + "xsltforms.xsl", false, "xsltforms_debug", "false", "baseuri", XsltForms_browser.xslROOT);
			} catch (e) {
				XsltForms_browser.debugConsole.write("ERROR: Could not get contents of xsltforms_debug - " + e.message);
			}			
			if (s.substring(0, 21) === '<?xml version="1.0"?>') {
				s = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' + s.substring(21);
			}
			var prow = window.open("about:blank","_blank");
			prow.document.write(s);
			prow.document.close();
		} else {
			XsltForms_browser.debugConsole.write("File not found (" + req.status + "): " + XsltForms_browser.ROOT + "xsltforms_" + tabname + ".xhtml");
		}
	},

		
/**
 * * '''init''' method : called from the generated '''init()''' function called at onload event
 */

	init: function() {
		XsltForms_browser.setValue(document.getElementById("statusPanel"), XsltForms_browser.i18n.get("status"));
		XsltForms_engine.htmlversion = XsltForms_browser.i18n.get("html");
		var b = document.body;
		XsltForms_engine.body = b;
		document.onhelp = function(){return false;};
		window.onhelp = function(){return false;};
		XsltForms_browser.events.attach(document, "keydown", function(evt) {
			if (evt.keyCode === 112) {
				XsltForms_engine.debugMode = !XsltForms_engine.debugMode;
				XsltForms_engine.debugModeging();
				if (evt.stopPropagation) {
					evt.stopPropagation();
					evt.preventDefault();
				} else {
					evt.cancelBubble = true;
				}
				return false;
			}
		}, false);
		XsltForms_browser.events.attach(b, "click", function(evt) {
			var target = XsltForms_browser.events.getTarget(evt);
			var parentElt = target;
			while (parentElt && parentElt.nodeType === Fleur.Node.ELEMENT_NODE) {
				if (XsltForms_browser.hasClass(parentElt, "xforms-repeat-item")) {
					XsltForms_repeat.selectItem(parentElt);
				}
				parentElt = parentElt.parentNode;
			}
			parentElt = target;
			while (parentElt && parentElt.nodeType === Fleur.Node.ELEMENT_NODE) {
				var xf = parentElt.xfElement;
				if (xf) {
					if(typeof parentElt.node !== "undefined" && parentElt.node && xf.focus && !XsltForms_browser.getBoolMeta(parentElt.node, "readonly")) {
						var tname = target.nodeName.toLowerCase();
						xf.focus(tname === "input" || tname === "textarea", evt);
					}
					if(xf.click && xf.input && !xf.input.disabled) {
						xf.click(target, evt);
						break;
					}
				}
				parentElt = parentElt.parentNode;
			}
		}, false);
		XsltForms_browser.events.onunload = function() {
			XsltForms_engine.close();
		};
		XsltForms_engine.openAction("XsltForms_engine.init");
		XsltForms_engine.models.forEach(function(m) {
			XsltForms_xmlevents.dispatch(m, "xforms-model-construct");
		});
		XsltForms_engine.componentLoads.forEach(function(cl) {
			eval(cl);
		});
		XsltForms_engine.refresh();
		XsltForms_engine.closeAction("XsltForms_engine.init");
		XsltForms_engine.ready = true;
		XsltForms_browser.dialog.hide("statusPanel", false);
	},

		
/**
 * * '''close''' method : performs every closing actions
 */

	close : function() {
		if (XsltForms_engine.body) {
			this.openAction("XsltForms_engine.close");
			//XsltForms_xmlevents.dispatchList(XsltForms_engine.models, "xforms-model-destruct");
			for (var i = 0, len = XsltForms_listener.destructs.length; i < len; i++) {
				XsltForms_listener.destructs[i].callback({target: XsltForms_listener.destructs[i].observer});
			}
			this.closeAction("XsltForms_engine.close");
			XsltForms_idManager.clear();
			this.defaultModel = null;
			this.changes = [];
			this.models = [];
			this.body = null;
			this.cont = 0;
			this.dispose(document.documentElement);
			XsltForms_listener.destructs = [];
			XsltForms_schema.all = {};
			XsltForms_typeDefs.initAll();
			XsltForms_calendar.INSTANCE = null;
			this.ready = false;
			this.building = false;
			XsltForms_engine.posibleBlur = false;
		}
	},

		
/**
 * * '''openAction''' method : simply clears the Debug Console
 */

	openActions : [],
	openAction : function(action) {
		//console.log("openAction(" + action + "): changes = " + this.changes.length + " / cont = " + this.cont);
		this.openActions.push(action);
		if (this.cont++ === 0) {
			XsltForms_browser.debugConsole.clear();
		}
	},

		
/**
 * * '''closeAction''' method : calls the '''closeChanges()''' method when every action has been performed
 * @callback
 */

	closeAction : function(action) {
		//console.log("closeAction(" + action + "): " + this.changes.length + "/" + this.cont);
		var lastaction = this.openActions.pop();
		if (lastaction !== action) {
			//alert("Action mismatch: '" + lastaction + "' was expected instead of '" + action + "'");
		}
		if (this.cont === 1) {
			this.closeChanges();
		}
		this.cont--;
	},

		
/**
 * * '''closeChanges''' method : rebuild or recalculate after changes
 */

	closeChanges : function(force) {
		var changes = this.changes;
		for (var i = 0, len = changes.length; i < len; i++) {
			var change = changes[i];
			if (change && change.instances) {//Model
				if (change.rebuilded) {
					XsltForms_xmlevents.dispatch(change, "xforms-rebuild");
				} else {
					XsltForms_xmlevents.dispatch(change, "xforms-recalculate");
				}
			//} else { // Repeat or tree
			}
		}
		if (changes.length > 0 || force) {
			this.refresh();
			if (this.changes.length > 0) {
				this.closeChanges();
			}
		}
	},

		
/**
 * * '''error''' method : XForms error management
 */

	error : function(element, evt, message, causeMessage) {
		XsltForms_browser.dialog.hide("statusPanel", false);
		XsltForms_browser.setValue(document.getElementById("statusPanel"), message);
		XsltForms_browser.dialog.show("statusPanel", null, false);
		if (element) {
			XsltForms_xmlevents.dispatch(element, evt);
		}
		if (causeMessage) {
			message += " : " + causeMessage;
		}
		XsltForms_browser.debugConsole.write("Error: " + message);
		throw evt;        
	},

		
/**
 * * '''refresh''' method : XForms refresh management
 */

	refresh : function() {
		var d1 = new Date();
		this.building = true;
		this.build(this.mainform, this.body, (this.defaultModel.getInstanceDocument() ? this.defaultModel.getInstanceDocument().documentElement : null), true);
		if (this.newChanges.length > 0) {
			this.changes = this.newChanges;
			this.newChanges = [];
		} else {
			this.changes.length = 0;
		}
		this.models.forEach(function(model) {
			if (model.newNodesChanged.length > 0 || model.newRebuilded) {
				model.nodesChanged = model.newNodesChanged;
				model.newNodesChanged = [];
				model.rebuilded = model.newRebuilded;
				model.newRebuilded = false;
			} else {
				model.nodesChanged.length = 0;
				model.rebuilded = false;
			}
		});
		this.building = false;
		// Throw any gathered binding-errors.
		//
		if (this.bindErrMsgs.length) {
			this.error(this.defaultModel, "xforms-binding-exception", "Binding Errors: \n" + this.bindErrMsgs.join("\n  "));
			this.bindErrMsgs = [];
		}
		var d2 = new Date();
		this.refreshtime += d2 - d1;
		this.refreshcount++;
	},

		
/**
 * * '''build''' method : XForms build management
 */

	build : function(subform, element, ctxnode, selected, varresolver) {
		if (element.nodeType !== Fleur.Node.ELEMENT_NODE || element.id === "xsltforms_console" || element.hasXFElement === false) {
			return {ctxnode: ctxnode, hasXFElement: false};
		}
		var nodeName = element.nodeName.toLowerCase();
		if (nodeName.startsWith("xforms-")) {
			if (!element.nextSibling || element.nextSibling.xfElement !== element) {
				var eltName = nodeName.split("-", 2)[1];
				var createfunc = XsltForms_engine.create[eltName];
				if (createfunc) {
					createfunc(subform, element);
				}
			}
		}
		var xf = element.xfElement;
		var hasXFElement = !!xf;
		if (element.getAttribute("mixedrepeat") === "true") {
			//ctx = element.node || ctx;
			selected = element.selected;
		}
		if (xf) {
			if (xf instanceof Array) {
				for (var ixf = 0, lenxf = xf.length; ixf < lenxf; ixf++) {
					xf[ixf].build(subform, ctxnode, varresolver);
				}
			} else {
				xf.build(subform, ctxnode, varresolver);
				if (xf.isRepeat) {
					xf.refresh(selected);
				}
			}
		}
		var newctxnode = element.node || ctxnode;
		var childs = element.children || element.childNodes;
		var sel = element.selected;
		if (typeof sel !== "undefined") {
			selected = sel;
		}
		if (!xf || (xf instanceof Array) || !xf.isRepeat || xf.nodes.length > 0) {
			var nbsiblings = 1, isiblings = 1;
			var nodes = [], nbnodes = 0, inodes = 0;
			for (var i = 0; i < childs.length && this.building; i++) {
				if (childs[i].nodeType !== Fleur.Node.TEXT_NODE) {
					var curctxnode;
					if (isiblings !== 1) {
						curctxnode = nodes[inodes];
						isiblings--;
					} else if (nbnodes !== 0) {
						nbnodes--;
						inodes++;
						curctxnode = nodes[inodes];
						isiblings = nbsiblings;
					} else {
						curctxnode = newctxnode;
					}
					if (!childs[i].getAttribute("cloned")) {
						var samechild = childs[i];
						var br = this.build(subform, childs[i], curctxnode, selected, varresolver);
						if (childs[i] !== samechild) {
							i--;
						} else {
							if (childs[i].xfElement && childs[i].xfElement.nbsiblings && childs[i].xfElement.nbsiblings > 1) {
								nbsiblings = childs[i].xfElement.nbsiblings;
								nodes = childs[i].xfElement.nodes;
								nbnodes = nodes.length;
								inodes = 0;
								isiblings = nbsiblings;
							}
							hasXFElement = br.hasXFElement || hasXFElement;
						}
					}
				}
			}
			element.varScope = null;
		}
		if(this.building) {
			if (xf instanceof Array) {
				for (var ixf2 = 0, lenxf2 = xf.length; ixf2 < lenxf2; ixf2++) {
					if (xf[ixf2] && xf[ixf2].changed) {
						xf[ixf2].refresh(selected);
						xf[ixf2].changed = false;
					}
				}
			} else {
				if (xf && xf.changed) {
					xf.refresh(selected);
					xf.changed = false;
				}
			}
			if (!element.hasXFElement) {
				element.hasXFElement = hasXFElement;
			}
		}
		return {ctxnode: newctxnode, hasXFElement: hasXFElement};
	},

		
/**
 * * '''addChange''' method : builds a stack of elements concerned with changes
 */

	addChange : function(element) {
		var list = this.building? this.newChanges : this.changes;
		if (!XsltForms_browser.inArray(element, list)) {
			list.push(element);
		}
	},

		
/**
 * * '''dispose''' method : disposes of an element
 */

	dispose : function(element) {
		if (element.nodeType !== Fleur.Node.ELEMENT_NODE || element.id === "xsltforms_console") {
			return;
		}
		var xf = element.xfElement;
		if (xf && xf.dispose !== undefined) {
			xf.dispose();
		}
		element.listeners = null;
		element.node = null;
		element.hasXFElement = null;
		var childs = element.childNodes;
		for (var i = 0; i < childs.length; i++) {
			this.dispose(childs[i]);
		}
	},

		
/**
 * * '''blur''' method : focus out management
 */

	blur : function(direct) {
		if ((direct || this.posibleBlur) && this.focus) {
			if (this.focus.element) {
				this.openAction("XsltForms_engine.blur");
				XsltForms_xmlevents.dispatch(this.focus, "DOMFocusOut");
				XsltForms_browser.setClass(this.focus.element, "xforms-focus", false);
				try {
					this.focus.blur();
				} catch (e){
				}
				this.closeAction("XsltForms_engine.blur");
			}
			this.posibleBlur = false;
			this.focus = null;
		}
	},

		
/**
 * * '''crypto''' method : encryption method
 */

	add32 : function(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		return ((((x >>> 16) + (y >>> 16) + (lsw >>> 16)) & 0xFFFF)<< 16) | (lsw & 0xFFFF);
		// return (x + y) & 0xFFFFFFFF;
	},
	str2msg : function(str) {
		var i, msg = {length: str.length, arr: []};
		for(i = 0; i < msg.length; i++){
			msg.arr[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((3 - i % 4) << 3);
		}
		return msg;
	},
	crypto : function(msg, algo) {
		var res, i, t, add32 = XsltForms_engine.add32;
		var a, b, c, d, e, f, g, h, T, l, bl, W;
		switch (algo) {
			case "SHA-1":
				bl = msg.length * 8;
				msg.arr[bl >> 5] |= 0x80 << (24 - bl % 32);
				msg.arr[((bl + 65 >> 9) << 4) + 15] = bl;
				l = msg.arr.length;
				W = [];
				res = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
				var rotl = function(x, n) {
					return (x <<  n) | (x >>> (32 - n));
				};
				for(i = 0; i < l; i += 16){
					a = res[0];
					b = res[1];
					c = res[2];
					d = res[3];
					e = res[4];
					for(t = 0; t<20; t++){
						T = add32(add32(add32(add32(rotl(a,5),(b & c)^(~b & d)),e),0x5a827999),W[t] = t<16 ? msg.arr[t+i] : rotl(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16],1));
						e = d;
						d = c;
						c = rotl(b,30);
						b = a;
						a = T;
					}
					for(t = 20; t<40; t++){
						T = add32(add32(add32(add32(rotl(a,5),b^c^d),e),0x6ed9eba1),W[t] = rotl(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16],1));
						e = d;
						d = c;
						c = rotl(b,30);
						b = a;
						a = T;
					}
					for(t = 40; t<60; t++){
						T = add32(add32(add32(add32(rotl(a,5),(b & c)^(b & d)^(c & d)),e),0x8f1bbcdc),W[t] = rotl(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16],1));
						e = d;
						d = c;
						c = rotl(b,30);
						b = a;
						a = T;
					}
					for(t = 60; t<80; t++){
						T = add32(add32(add32(add32(rotl(a,5),b^c^d),e),0xca62c1d6),W[t] = rotl(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16],1));
						e = d;
						d = c;
						c = rotl(b,30);
						b = a;
						a = T;
					}
					res[0] = add32(a, res[0]);
					res[1] = add32(b, res[1]);
					res[2] = add32(c, res[2]);
					res[3] = add32(d, res[3]);
					res[4] = add32(e, res[4]);
				}
				return {length: 20, arr: res};
			case "MD5":
				var n = msg.length;
				var cmn = function(q, a, b, x, s, t) {
					a = add32(add32(a, q), add32(x, t));
					return add32((a << s) | (a >>> (32 - s)), b);
				};
				var f1 = function(a, b, c, d, x, s, t) {
					return cmn((b & c) | ((~b) & d), a, b, x, s, t);
				};
				var f2 = function(a, b, c, d, x, s, t) {
					return cmn((b & d) | (c & (~d)), a, b, x, s, t);
				};
				var f3 = function(a, b, c, d, x, s, t) {
					return cmn(b ^ c ^ d, a, b, x, s, t);
				};
				var f4 = function(a, b, c, d, x, s, t) {
					return cmn(c ^ (b | (~d)), a, b, x, s, t);
				};
				var cycle = function (w, t) {
					a = w[0];
					b = w[1];
					c = w[2];
					d = w[3];
					a = f1(a, b, c, d, t[0], 7, -680876936);
					d = f1(d, a, b, c, t[1], 12, -389564586);
					c = f1(c, d, a, b, t[2], 17,  606105819);
					b = f1(b, c, d, a, t[3], 22, -1044525330);
					a = f1(a, b, c, d, t[4], 7, -176418897);
					d = f1(d, a, b, c, t[5], 12,  1200080426);
					c = f1(c, d, a, b, t[6], 17, -1473231341);
					b = f1(b, c, d, a, t[7], 22, -45705983);
					a = f1(a, b, c, d, t[8], 7,  1770035416);
					d = f1(d, a, b, c, t[9], 12, -1958414417);
					c = f1(c, d, a, b, t[10], 17, -42063);
					b = f1(b, c, d, a, t[11], 22, -1990404162);
					a = f1(a, b, c, d, t[12], 7,  1804603682);
					d = f1(d, a, b, c, t[13], 12, -40341101);
					c = f1(c, d, a, b, t[14], 17, -1502002290);
					b = f1(b, c, d, a, t[15], 22,  1236535329);
					a = f2(a, b, c, d, t[1], 5, -165796510);
					d = f2(d, a, b, c, t[6], 9, -1069501632);
					c = f2(c, d, a, b, t[11], 14,  643717713);
					b = f2(b, c, d, a, t[0], 20, -373897302);
					a = f2(a, b, c, d, t[5], 5, -701558691);
					d = f2(d, a, b, c, t[10], 9,  38016083);
					c = f2(c, d, a, b, t[15], 14, -660478335);
					b = f2(b, c, d, a, t[4], 20, -405537848);
					a = f2(a, b, c, d, t[9], 5,  568446438);
					d = f2(d, a, b, c, t[14], 9, -1019803690);
					c = f2(c, d, a, b, t[3], 14, -187363961);
					b = f2(b, c, d, a, t[8], 20,  1163531501);
					a = f2(a, b, c, d, t[13], 5, -1444681467);
					d = f2(d, a, b, c, t[2], 9, -51403784);
					c = f2(c, d, a, b, t[7], 14,  1735328473);
					b = f2(b, c, d, a, t[12], 20, -1926607734);
					a = f3(a, b, c, d, t[5], 4, -378558);
					d = f3(d, a, b, c, t[8], 11, -2022574463);
					c = f3(c, d, a, b, t[11], 16,  1839030562);
					b = f3(b, c, d, a, t[14], 23, -35309556);
					a = f3(a, b, c, d, t[1], 4, -1530992060);
					d = f3(d, a, b, c, t[4], 11,  1272893353);
					c = f3(c, d, a, b, t[7], 16, -155497632);
					b = f3(b, c, d, a, t[10], 23, -1094730640);
					a = f3(a, b, c, d, t[13], 4,  681279174);
					d = f3(d, a, b, c, t[0], 11, -358537222);
					c = f3(c, d, a, b, t[3], 16, -722521979);
					b = f3(b, c, d, a, t[6], 23,  76029189);
					a = f3(a, b, c, d, t[9], 4, -640364487);
					d = f3(d, a, b, c, t[12], 11, -421815835);
					c = f3(c, d, a, b, t[15], 16,  530742520);
					b = f3(b, c, d, a, t[2], 23, -995338651);
					a = f4(a, b, c, d, t[0], 6, -198630844);
					d = f4(d, a, b, c, t[7], 10,  1126891415);
					c = f4(c, d, a, b, t[14], 15, -1416354905);
					b = f4(b, c, d, a, t[5], 21, -57434055);
					a = f4(a, b, c, d, t[12], 6,  1700485571);
					d = f4(d, a, b, c, t[3], 10, -1894986606);
					c = f4(c, d, a, b, t[10], 15, -1051523);
					b = f4(b, c, d, a, t[1], 21, -2054922799);
					a = f4(a, b, c, d, t[8], 6,  1873313359);
					d = f4(d, a, b, c, t[15], 10, -30611744);
					c = f4(c, d, a, b, t[6], 15, -1560198380);
					b = f4(b, c, d, a, t[13], 21,  1309151649);
					a = f4(a, b, c, d, t[4], 6, -145523070);
					d = f4(d, a, b, c, t[11], 10, -1120210379);
					c = f4(c, d, a, b, t[2], 15,  718787259);
					b = f4(b, c, d, a, t[9], 21, -343485551);
					w[0] = add32(a, w[0]);
					w[1] = add32(b, w[1]);
					w[2] = add32(c, w[2]);
					w[3] = add32(d, w[3]);
				};
				res = [1732584193, -271733879, -1732584194, 271733878];
				i = 0;
				while (i <= n - 64) {
					t = [];
					do {
						t.push(((msg.arr[i >> 2] & 0xFF000000) >>> 24) | ((msg.arr[i >> 2] & 0x00FF0000) >>> 8) | ((msg.arr[i >> 2] & 0x0000FF00) << 8) | ((msg.arr[i >> 2] & 0x000000FF) << 24));
						i += 4;
					} while ( i % 64 !== 0 );
					cycle(res, t);
				}
				t = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				var j = 0;
				while ( i < n ) {
					t[j >> 2] = ((msg.arr[i >> 2] & 0xFF000000) >>> 24) | ((msg.arr[i >> 2] & 0x00FF0000) >>> 8) | ((msg.arr[i >> 2] & 0x0000FF00) << 8) | ((msg.arr[i >> 2] & 0x000000FF) << 24);
					i++;
					j++;
				}
				t[j >> 2] |= 0x80 << ((j % 4) << 3);
				if (j > 55) {
					cycle(res, t);
					t = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				}
				t[14] = n * 8;
				cycle(res, t);
				var k;
				for (k = 0, l = res.length; k < l; k++) {
					res[k] = ((res[k] & 0xFF) << 24) | (((res[k] >> 8) & 0xFF) << 16) | (((res[k] >> 16) & 0xFF) << 8) | ((res[k] >> 24) & 0xFF);
				}
				return {length: 16, arr: res};
			case "SHA-256":
				bl = msg.length * 8;
				msg.arr[bl >> 5] |= 0x80 << (24 - bl % 32);
				msg.arr[((bl + 65 >> 9) << 4) + 15] = bl;
				var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
					0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
					0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
					0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
					0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
					0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
					0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
					0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
				W = [];
				res = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
				l = msg.arr.length;
				for(i = 0; i < l; i += 16){
					a = res[0];
					b = res[1];
					c = res[2];
					d = res[3];
					e = res[4];
					f = res[5];
					g = res[6];
					h = res[7];
					for(t = 0; t < 64; t++){
						if (t < 16) {
							W[t] = msg.arr[i + t];
						} else {
							var g0 = W[t - 15];
							var g1 = W[t - 2];
							W[t] = add32(add32(add32(((g0 << 25) | (g0 >>> 7)) ^ ((g0 << 14) | (g0 >>> 18)) ^ (g0 >>> 3), W[t - 7]), ((g1 << 15) | (g1 >>> 17)) ^ ((g1 << 13) | (g1 >>> 19)) ^ (g1 >>> 10)), W[t - 16]);
						}
						var a1 = add32(add32(add32(add32(h, ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25))), (e & f) ^ (~e & g)), K[t]), W[t]);
						var a2 = add32(((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22)), (a & b) ^ (a & c) ^ (b & c));
						h = g;
						g = f;
						f = e;
						e = add32(d, a1);
						d = c;
						c = b;
						b = a;
						a = add32(a1, a2);
					}
					res[0] = add32(a, res[0]);
					res[1] = add32(b, res[1]);
					res[2] = add32(c, res[2]);
					res[3] = add32(d, res[3]);
					res[4] = add32(e, res[4]);
					res[5] = add32(f, res[5]);
					res[6] = add32(g, res[6]);
					res[7] = add32(h, res[7]);
				}
				return {length: 32, arr: res};
			case "BASE64":
				var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
				msg = msg.replace(/\r\n/g,"\n");
				var l2b = msg.length;
				var str = "";
				for (i = 0; i < l2b; i++) {
					var c0 = msg.charCodeAt(i);
					str += c0 < 128 ? msg.charAt(i) : c0 > 127 && c0 < 2048 ? String.fromCharCode(c0 >> 6 | 192, c0 & 63 | 128) : String.fromCharCode(c0 >> 12 | 224, c0 >> 6 & 63 | 128, c0 & 63 | 128);
				}
				l2b = str.length;
				res = "";
				for (i = 0; i < l2b; i += 3) {
					var c1b = str.charCodeAt(i);
					var c2b = i + 1 < l2b ? str.charCodeAt(i + 1) : 0;
					var c3b = i + 2 < l2b ? str.charCodeAt(i + 2) : 0;
					res += b64.charAt(c1b >> 2) + b64.charAt((c1b & 3) << 4 | c2b >> 4) + (i + 1 < l2b ? b64.charAt((c2b & 15) << 2 | c3b >> 6) : "=") + (i + 2 < l2b ? b64.charAt(c3b & 63) : "=");
				}
				return res;
		}
	},

		
/**
 * * '''encode''' method : encoding method
 */

	hex32 : function(v) {
		var h = v >>> 16;
		var l = v & 0xFFFF;
		return (h >= 0x1000 ? "" : h >= 0x100 ? "0" : h >= 0x10 ? "00" : "000") + h.toString(16) + (l >= 0x1000 ? "" : l >= 0x100 ? "0" : l >= 0x10 ? "00" : "000") + l.toString(16);
	},
	encode : function(msg, enco) {
		var str = "", l, i, c1, c2, c3, b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		if (enco === "base64") {
			for (i = 0, l = msg.length; i < l; i += 3) {
				c1 = (msg.arr[i >> 2] >> (24 - (i % 4) * 8)) & 0xFF;
				c2 = i + 1 < l ? (msg.arr[(i + 1) >> 2] >> (24 - ((i + 1) % 4) * 8))& 0xFF : 0;
				c3 = i + 2 < l ? (msg.arr[(i + 2) >> 2] >> (24 - ((i + 2) % 4) * 8))& 0xFF : 0;
				str += b64.charAt(c1 >> 2) + b64.charAt((c1 & 3) << 4 | c2 >> 4) + (i + 1 < l ? b64.charAt((c2 & 15) << 2 | c3 >> 6) : "=") + (i + 2 < l ? b64.charAt(c3 & 63) : "=");
			}
			return str;
		}
		str = "";
		for (i = 0, l = msg.length >> 2; i < l; i++) {
			str += XsltForms_engine.hex32(msg.arr[i]);
		}
		if (msg.length % 4 !== 0) {
			str += (msg.arr[msg.length >> 2] >>> (8 * (4 - msg.length % 4))).toString(16);
		}
		return str;
	},

/**
 * * '''create''' object : set of functions to add properties and methods to XForms elements
 */
	create : {}

};