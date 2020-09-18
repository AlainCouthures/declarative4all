/*eslint-env browser*/
/*globals XsltForms_element XsltForms_class XsltForms_browser XsltForms_globals XsltForms_classes XsltForms_collection XsltForms_avt*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module group
 * @description  === "XsltForms_dialog" class ===
 * Dialog Element Class
 * * constructor function : sets specific properties
 */
	
new XsltForms_class("XsltForms_include", "HTMLElement", "xforms-include");
		
function XsltForms_include(subform, elt) {
	this.init(subform, elt);
	var href = elt.getAttribute("xf-src");
	var req = null;
	var method = "get";
	try {
		req = XsltForms_browser.openRequest(method, href, false);
		XsltForms_browser.debugConsole.write("Include " + href);
		req.send(null);
		if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {

			return;
		}
		var resp = req.responseText;
		var piindex = resp.indexOf("<?xml-stylesheet", 0);
		while ( piindex !== -1) {
			var xslhref = resp.substr(piindex, resp.substr(piindex).indexOf("?>")).replace(/^.*href=\"([^\"]*)\".*$/, "$1");
			resp = XsltForms_browser.transformText(resp, xslhref, false);
			piindex = resp.indexOf("<?xml-stylesheet", 0);
		}
		var sp = XsltForms_globals.stringSplit(resp, "<!--XsltForms_MagicSeparator-->");
		var subbody;
		if (sp.length === 1) {
			subbody = resp;
		} else {
			subbody = sp[1];
		}
		elt.innerHTML = subbody;
		for (var xcname in XsltForms_classes) {
			if (XsltForms_classes.hasOwnProperty(xcname)) {
				Array.prototype.slice.call(elt.getElementsByTagName(xcname)).forEach(function(elt2) { XsltForms_classes[elt2.localName].classbinding(subform, elt2); });
			}
		}
		Array.prototype.slice.call(elt.querySelectorAll('*[xf-avt]')).forEach(function(elt2) {
			if (!elt2.xfElement) {
				elt2.xfIndex = XsltForms_collection.length;
				XsltForms_collection.push(elt2);
				Array.prototype.slice.call(elt2.attributes).filter(function(a) {
					return a.nodeName.startsWith('xf-template-');
				}).forEach(function(a) {
					new XsltForms_avt(subform, elt2, a.nodeName.substr(12));
				});
			}
		});
	} catch(e2) {
	}
}

XsltForms_include.prototype = new XsltForms_element();
