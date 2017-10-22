/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_element XsltForms_browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module label
 * @description  === "XsltForms_label" class ===
 * Label Element  Class
 * * constructor function : initializes specific properties
 */
		
function XsltForms_label(subform, id, binding) {
	XsltForms_globals.counters.label++;
	this.init(subform, id);
	this.controlName = "label";
	if (binding) {
		this.hasBinding = true;
		this.binding = binding;
	}
}

XsltForms_label.prototype = new XsltForms_element();


		
/**
 * * '''clone''' method : creates a new label element with the given id
 */

XsltForms_label.prototype.clone = function(id) { 
	return new XsltForms_label(this.subform, id, this.binding);
};


		
/**
 * * '''dispose''' method : decrements the number of labels and calls the parent dispose() method
 */

XsltForms_label.prototype.dispose = function() {
	XsltForms_globals.counters.label--;
	XsltForms_element.prototype.dispose.call(this);
};


		
/**
 * * '''build_''' method : specific build method
 */

XsltForms_label.prototype.build_ = function(ctx) {
	var nodes = this.evaluateBinding(this.binding, ctx);
	this.element.node = nodes[0];
	this.depsNodesRefresh.push(nodes[0]);
};


		
/**
 * * '''refresh''' method : refreshes this label element
 */

XsltForms_label.prototype.refresh = function() {
	var node = this.element.node;
	var value = node? XsltForms_browser.getValue(node, true) : "";
	XsltForms_browser.setValue(this.element.getAttributeNode("label") ? this.element.getAttributeNode("label") : this.element, value);
};