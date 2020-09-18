/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_browser XsltForms_class XsltForms_subform XsltForms_xpath*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module setproperty
 * @description 
 */

new XsltForms_class("XsltForms_setproperty", "HTMLElement", "xforms-setproperty");

function XsltForms_setproperty(subform, elt) {
	this.subform = subform;
	this.name = elt.getAttribute("xf-pname");
	this.value = elt.hasAttribute("xf-value") ? XsltForms_xpath.create(this.subform, elt.getAttribute("xf-value")) : null;
	this.literal = elt.textContent || "";
	this.init(elt);
}

XsltForms_setproperty.prototype = new XsltForms_abstractAction();

/**
 * @callback
 */
XsltForms_setproperty.prototype.run = function(element, ctx) {
	var value = this.literal;
	if (this.value) {
		//value = this.value.evaluate(node); // ??? What is node?
		if (typeof(value) !== "string" && typeof(value.length) !== "undefined") {
			value = value.length > 0? XsltForms_browser.getValue(value[0]) : "";
		}
	}
	if (value) {
		XsltForms_browser.i18n.lang = value;
		XsltForms_browser.debugConsole.write("setproperty " + name + " = " + value);
	}
};