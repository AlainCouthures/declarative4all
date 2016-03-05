/*eslint-env browser*/
/*globals XsltForms_engine XsltForms_control*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module var
 * @description  === "XsltForms_var" class ===
 * Var Control  Class
 * * constructor function : initializes specific properties and initializes scope
 */
		
function XsltForms_var(subform, id, vname, binding) {
	XsltForms_engine.counters.xvar++;
	this.init(subform, id);
	if (!this.element.parentNode.varScope) {
		this.element.parentNode.varScope = {};
	}
	this.element.parentNode.varScope[vname] = id;
	this.controlName = "var";
	this.name = vname;
	this.hasBinding = true;
	this.binding = binding;
	this.isOutput = true;
}

//XsltForms_var.prototype = new XsltForms_control();


		
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
	XsltForms_engine.counters.xvar--;
	XsltForms_control.prototype.dispose.call(this);
};