/*eslint-env browser*/
/*globals XsltForms_element XsltForms_class XsltForms_browser XsltForms_globals XsltForms_classes XsltForms_collection XsltForms_avt*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module options
 * @description  === "XsltForms_options" class ===
 * Options Element Class
 * * constructor function : sets specific properties
 */
	
new XsltForms_class("XsltForms_options", "HTMLElement", "xforms-options");
		
function XsltForms_options(subform, elt) {
	this.init(subform, elt);
	var debug = elt.getAttribute("xf-debug");
	if (debug && debug.toLowerCase() === "yes") {
		XsltForms_globals.debugMode = true;
		XsltForms_globals.debugging();
	}
	var lang = elt.getAttribute("xf-lang");
	if (lang) {
		XsltForms_globals.language = lang;
	}
}

XsltForms_options.prototype = new XsltForms_coreElement();