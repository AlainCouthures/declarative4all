/*eslint-env browser*/
/*globals XsltForms_element XsltForms_class XsltForms_globals XsltForms_browser XsltForms_subform XsltForms_binding*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module group
 * @description  === "XsltForms_dialog" class ===
 * Dialog Element Class
 * * constructor function : sets specific properties
 */
	
new XsltForms_class("XsltForms_dialog", "HTMLElement", "xforms-dialog");
		
function XsltForms_dialog(subform, elt) {
	var ds = document.getElementsByTagName("xforms-dialog-surround");
	if (ds.length === 0) {
		document.body.appendChild(document.createElement("xforms-dialog-surround"));
	}
	XsltForms_globals.counters.dialog++;
	this.init(subform, elt);
	this.controlName = "dialog";
	this.binding = elt.hasAttribute("xf-ref") || elt.hasAttribute("xf-bind") ? new XsltForms_binding(subform, elt) : null;
	if (this.binding) {
		this.hasBinding = true;
	}
	//this.casebinding = casebinding;
}

XsltForms_dialog.prototype = new XsltForms_element();
