/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser XsltForms_control XsltForms_element XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module trigger
 * @description  === "XsltForms_trigger" class ===
 * Trigger Control  Class
 * * constructor function : initializes specific properties and initializes focus event management
 */
		
function XsltForms_trigger(subform, id, binding) {
	XsltForms_globals.counters.trigger++;
	this.init(subform, id);
	this.controlName = "trigger";
	this.binding = binding;
	this.hasBinding = !!binding;
	if(!this.hasBinding) {
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
	this.isTrigger = true;
	var anchor = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "a")[0] : this.element.getElementsByTagName("a")[0];
	if (anchor !== null && typeof anchor !== "undefined") {
		if (!anchor.hasAttribute("href")) {
			anchor.setAttribute("href", "#/");
		}
	}
	var button = XsltForms_browser.isXhtml ? (this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "a")[0] || this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "button")[0]) : (this.element.getElementsByTagName("a")[0] || this.element.getElementsByTagName("button")[0]);
	this.input = button;
	this.initFocus(button);
}

XsltForms_trigger.prototype = new XsltForms_control();


		
/**
 * * '''setValue''' method : empty
 */

XsltForms_trigger.prototype.setValue = function () { };


		
/**
 * * '''changeReadonly''' method : changes the read only state of this input control
 */

XsltForms_trigger.prototype.changeReadonly = function() {
	this.input.disabled = this.readonly;
};


		
/**
 * * '''clone''' method : creates a new trigger control with the given id
 */

XsltForms_trigger.prototype.clone = function (id) {
	return new XsltForms_trigger(this.subform, id, this.binding, true);
};


		
/**
 * * '''dispose''' method : decrements the number of triggers and calls the parent dispose() method
 */

XsltForms_trigger.prototype.dispose = function() {
	XsltForms_globals.counters.trigger--;
	XsltForms_element.prototype.dispose.call(this);
};


		
/**
 * * '''click''' method : dispatches a "DOMActivate" event
 * @callback
 */

XsltForms_trigger.prototype.click = function (target, evcontext) {
	XsltForms_globals.openAction("XsltForms_trigger.prototype.click");
	XsltForms_xmlevents.dispatch(this, "DOMActivate", null, null, null, null, evcontext);
	XsltForms_globals.closeAction("XsltForms_trigger.prototype.click");
};


		
/**
 * * '''blur''' method : empty
 */

XsltForms_trigger.prototype.blur = function () { };