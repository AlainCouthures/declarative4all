/*eslint-env browser*/
/*globals XsltForms_browser */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module CoreElement
 * @description  === "XsltForms_coreElement" class ===
 * Parent class for each Model component class
 */
		
function XsltForms_coreElement() {
}


		
/**
 * * '''init''' method : creates a "span" element under the "head" element to store this object
 */

XsltForms_coreElement.prototype.init = function(subform, id) {
	this.subforms = [];
	this.subforms[subform] = true;
	this.nbsubforms = 1;
	this.subform = subform;
	this.element = document.getElementById(id);
	this.element.xfElement = this;
};


		
/**
 * * '''dispose''' method : clears the properties of this object
 */

XsltForms_coreElement.prototype.dispose = function() {
	this.element.xfElement = null;
	this.element.parentNode.removeChild(this.element);
	this.element = null;
	this.model = null;
};