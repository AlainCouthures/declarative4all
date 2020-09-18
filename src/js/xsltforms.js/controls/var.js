/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_control XsltForms_class XsltForms_subform XsltForms_binding XsltForms_xpath*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module var
 * @description  === "XsltForms_var" class ===
 * Var Control  Class
 * * constructor function : initializes specific properties and initializes scope
 */
		
new XsltForms_class("XsltForms_var", "HTMLElement", "xforms-var");

function XsltForms_var(subform, elt) {
	XsltForms_globals.counters.xvar++;
	this.init(subform, elt);
	if (!this.element.parentNode.varScope) {
		this.element.parentNode.varScope = {};
	}
	var vname = elt.getAttribute("xf-name");
	this.element.parentNode.varScope[vname] = this;
	this.name = vname;
	if (elt.parentNode.localName.toLowerCase() === "xforms-action") {
		this.controlName = "action-var";
		this.hasBinding = false;
		this.value = XsltForms_xpath.create(this.subform, elt.getAttribute("xf-value"));
	} else {
		this.controlName = "var";
		this.hasBinding = true;
		this.binding = new XsltForms_binding(subform, elt);
		this.isOutput = true;
	}
}

XsltForms_var.prototype = new XsltForms_control();


		
/**
 * * '''clone''' method : creates a new var control with the given id
 */

XsltForms_var.prototype.clone = function(id) { 
	return new XsltForms_var(this.subform, id, this.name, this.binding);
};


		
/**
 * * '''dispose''' method : clears properties of this control and calls the parent dispose() method
 */

XsltForms_var.prototype.dispose = function() {
	XsltForms_globals.counters.xvar--;
	XsltForms_control.prototype.dispose.call(this);
};


		
/**
 * * '''execute''' method : evaluates the var value when within an action
 */

XsltForms_var.prototype.execute = function(element, ctx, evt) {
	if (!ctx) {
		ctx = element.node || (XsltForms_globals.defaultModel.getInstanceDocument() ? XsltForms_globals.defaultModel.getInstanceDocument().documentElement : null);
	}
	this.boundnodes = this.value.xpath_evaluate(ctx);
};