/*eslint-env browser*/
/*globals customElements addLoadListener XsltForms_browser XsltForms_avt XsltForms_globals XsltForms_schema XsltForms_repeat*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module class
 * @description  === "class" function ===
 * Class declaration function for custom elements
 */

var XsltForms_classes = {};
var XsltForms_collection = [];
		
function XsltForms_class(className, parentName, customElementName, template) {
	XsltForms_classes[customElementName] = this;
	this.className = className;
	this.parentName = parentName;
	this.customElementName = customElementName;
	this.template = document.createElement(this.customElementName);
	this.template.innerHTML = template;
	this.template = Array.prototype.slice.call(this.template.children);
	this.classbinding = new Function("subform", "elt", "if (!elt.xfElement) { XsltForms_classes[elt.localName.toLowerCase()].applyTemplate(elt); elt.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt); elt.xfElement = new " + this.className + "(subform, elt); }");
	if (typeof customElements !== "undefined") {
		var instr;
		this.upperClassName = this.customElementName.replace(/([-_]\w)/g, function(g) { return g[1].toUpperCase(); });
		instr = "class " + this.upperClassName + " extends " + this.parentName + " { constructor() { super(); } };";
		instr += " customElements.define('" + this.customElementName + "', " + this.upperClassName + ");";
		try {
			eval(instr);
		} catch(e) {}
	}
	//XsltForms_browser.addLoadListener(new Function(
	//	"Array.prototype.slice.call(document.getElementsByTagName('" + customElementName + "')).forEach(function(elt) { XsltForms_classes[elt.localName].classbinding(XsltForms_subform.subforms['xsltforms-mainform'], elt); });"
	//));
	//document.addEventListener("DOMContentLoaded", new Function(
	//	"Array.prototype.slice.call(document.getElementsByTagName('" + customElementName + "')).forEach(function(elt) { elt.xfElement = new " + className + "(elt); });"
	//));
}

XsltForms_class.activateAll = function(subform, elt, callback) {
	var scharr = [];
	Array.prototype.slice.call(elt.querySelectorAll("xforms-model[xf-schema]")).forEach(function(m) {
		scharr = scharr.concat(m.getAttribute("xf-schema").split(" ").map(function(sch) {
			return [m, sch];
		}));
	});
	var schback = function() {
		for (var xcname in XsltForms_classes) {
			if (XsltForms_classes.hasOwnProperty(xcname)) {
				Array.prototype.slice.call(elt.getElementsByTagName(xcname)).forEach(function(elt2) { XsltForms_classes[elt2.localName].classbinding(subform, elt2); });
			}
		}
		Array.prototype.slice.call(elt.querySelectorAll('*[xf-repeat-ref]')).forEach(function(elt2) { if (!elt2.xfElement) { elt2.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt2); elt2.xfElement = new XsltForms_repeat(subform, elt2); } });
		Array.prototype.slice.call(elt.querySelectorAll('*[xf-repeat-bind]')).forEach(function(elt2) { if (!elt2.xfElement) { elt2.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt2); elt2.xfElement = new XsltForms_repeat(subform, elt2); } });
		Array.prototype.slice.call(elt.querySelectorAll('*[xforms-name="repeat"]')).forEach(function(elt2) { if (!elt2.xfElement) { elt2.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt2); elt2.xfElement = eval("new " + XsltForms_classes["xforms-" + elt.getAttribute("xforms-name")].classname + "(subform, elt2)"); } });
		Array.prototype.slice.call(elt.querySelectorAll('*[xf-avt]')).forEach(function(elt2) {
			if (!elt2.xfElement) {
				elt2.xfIndex = XsltForms_collection.length;
				XsltForms_collection.push(elt2);
			}
			Array.prototype.slice.call(elt2.attributes).filter(function(a) {
				return a.nodeName.startsWith('xf-template-');
			}).forEach(function(a) {
				new XsltForms_avt(subform, elt2, a.nodeName.substr(12));
			});
		});
		callback();
	};
	var schloader = function(arr, callback) {
		if (arr.length === 0) {
			return callback();
		}
		var sch = arr.pop();
		var m = sch[0];
		sch = sch[1];
		var req = XsltForms_browser.openRequest("GET", sch, true);
		var func = function() {
			if (req.readyState !== 4) {
				return;
			}
			try {
				if (req.status === 1223) {
					req.status = 204;
					req.statusText = "No Content";
				}
				if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
					XsltForms_globals.error(m.xfElement, "xforms-link-exception", "Schema not found");
					throw new Error("Error");
				}
				var ndoc = XsltForms_browser.createXMLDocument(req.responseText);
				new XsltForms_schema(subform, ndoc.documentElement.getAttribute("targetNamespace"), sch, {}, ndoc);
			} catch (e) {
			}
			//alert(sch + " for " + m.id);
			schloader(arr, callback);
		};
		req.onreadystatechange = func;
		if (req.overrideMimeType) {
			req.overrideMimeType("application/xml");
		}
		try {        
			req.send(null);
		} catch(e) {
			alert("File not found: " + sch);
		}
	};
	schloader(scharr.reverse(), schback);
};

XsltForms_class._applyTemplate = function(elt, template) {
	var children = elt.children || elt.childNodes;
	var childarr = Array.prototype.slice.call(children).map(function(e) { return e.localName.toLowerCase(); });
	var pos = 0;
	template.forEach(function(t) {
		var inc = childarr.indexOf(t.localName);
		var n = t.localName;
		if (!n.startsWith("xforms-")) {
			n = "xforms-" + t.getAttribute("xforms-name");
		}
		if (inc !== -1) {
			pos = inc + 1;
		} else if (n === "xforms-body" || n === "xforms-alert" || n === "xforms-required" || t.childNodes.length !== 0) {
			elt.insertBefore(t.cloneNode(true), children[pos]);
			childarr = Array.prototype.slice.call(children).map(function(e) { return e.localName.toLowerCase(); });
			pos++;
		}
	});
	var label;
	Array.prototype.slice.call(children).forEach(function(child) {
		var n = child.localName.toLowerCase();
		if (((n === "xforms-hint" && child.getAttribute("xf-appearance") !== "minimal") || (n === "xforms-help" && child.getAttribute("xf-appearance") !== "minimal") || n === "xforms-alert") && (!child.previousSibling || !child.previousSibling.localName || child.previousSibling.localName.toLowerCase() !== n + "-mark")) {
			elt.insertBefore(document.createElement(n + "-mark"), child);
		} else if (n === "xforms-label") {
			label = child;
		}
	});
	if (label) {
		Array.prototype.slice.call(children).forEach(function(child) {
			var n = child.localName.toLowerCase();
			if (n === "xforms-help" && child.getAttribute("xf-appearance") === "minimal") {
				elt.insertBefore(child, label.nextSibling);
			}
		});
	}
};

XsltForms_class.prototype.applyTemplate = function(elt) {
	XsltForms_class._applyTemplate(elt, this.template);
};