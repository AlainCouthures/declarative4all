/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module setproperty
 * @description 
 */
function XsltForms_setproperty(subform, pname, value, literal, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.name = pname;
	this.value = value;
	this.literal = literal;
	this.init(ifexpr, whileexpr, iterateexpr);
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