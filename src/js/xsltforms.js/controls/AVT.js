/*eslint-env browser*/
/*globals XsltForms_control Fleur XsltForms_globals*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module AVT
 * @description  === "XsltForms_avt" class ===
 * AVT Control  Class
 * * constructor function : initializes specific properties and initializes focus and blur event management
 */
		
function XsltForms_avt(subform, id, attrname, binding) {
	this.init(subform, id);
	this.controlName = "avt";
	this.attrname = attrname;
	this.binding = binding;
	this.hasBinding = true;
	this.isOutput = true;
	if (attrname.toLowerCase() === "id") {
		var calcid = "xsltforms-id-";
		var elt = this.element;
		var prev = 1;
		while (elt.nodeType === Fleur.Node.ELEMENT_NODE) {
			while (elt.previousSibling) {
				if (elt.nodeType === Fleur.Node.ELEMENT_NODE) {
					prev++;
				}
				elt = elt.previousSibling;
			}
			calcid += prev + "_";
			elt = elt.parentNode;
			prev = 1;
		}
		this.element.setAttribute("id", calcid);
	} else if (this.binding && this.binding.type) {
		this.element.setAttribute(this.attrname, "");
	}
}

XsltForms_avt.prototype = new XsltForms_control();


		
/**
 * * '''clone''' method : creates a new output control with the given id
 */

XsltForms_avt.prototype.clone = function(id) { 
	return new XsltForms_avt(this.subform, id, this.attrname, this.binding);
};


		
/**
 * * '''dispose''' method : clears properties of this control and calls the parent dispose() method
 */

XsltForms_avt.prototype.dispose = function() {
	XsltForms_control.prototype.dispose.call(this);
};


		
/**
 * * '''setValue''' method : sets the value of this AVT control
 */

XsltForms_avt.prototype.setValue = function(value) {
	if (this.attrname === "id" && this.element.id === this.element.getAttribute("oldid")) {
		if (!XsltForms_globals.idalt) {
			XsltForms_globals.idalt = {};
		}
		XsltForms_globals.idalt[this.element.id] = this.element;
	}
	this.element.setAttribute(this.attrname, value);
};

		
/**
 * * '''getValue''' method : gets the value of this AVT control
 * @callback
 */

XsltForms_avt.prototype.getValue = function(value) {
	return this.element.getAttribute(this.attrname);
};