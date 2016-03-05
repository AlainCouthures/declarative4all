/*eslint-env browser*/
/*globals XsltForms_element XsltForms_engine XsltForms_browser XsltForms_toggle*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module group
 * @description  === "XsltForms_group" class ===
 * Group Element Class
 * * constructor function : sets specific properties
 */
		
function XsltForms_group(subform, id, binding, casebinding) {
	XsltForms_engine.counters.group++;
	this.init(subform, id);
	this.controlName = "group";
	if (binding) {
		this.hasBinding = true;
		this.binding = binding;
	} else {
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
	this.casebinding = casebinding;
}

//XsltForms_group.prototype = new XsltForms_element();


		
/**
 * * '''dispose''' method : decrements the number of groups and calls the parent dispose() method
 */

XsltForms_group.prototype.dispose = function() {
	XsltForms_engine.counters.group--;
	XsltForms_element.prototype.dispose.call(this);
};


		
/**
 * * '''clone''' method : creates a new group with the given id
 */

XsltForms_group.prototype.clone = function(id) { 
	return new XsltForms_group(this.subform, id, this.binding, this.casebinding);
};


		
/**
 * * '''build_''' method : specific build method
 */

XsltForms_group.prototype.build_ = function(ctx) {
	var nodes = this.evaluateBinding(this.binding, ctx);
	this.element.node = nodes[0];
	this.depsNodesRefresh.push(nodes[0]);
	if (this.casebinding) {
		var caseref = this.evaluateBinding(this.casebinding, nodes[0]);
		if (caseref) {
			XsltForms_toggle.toggle(XsltForms_engine.stringValue(caseref));
		}
	}
};


		
/**
 * * '''refresh''' method : sets "xforms-disabled" CSS class
 */

XsltForms_group.prototype.refresh = function() {
	var element = this.element;
	var disabled = !element.node || XsltForms_browser.getBoolMeta(element.node, "notrelevant");
	XsltForms_browser.setClass(element, "xforms-disabled", disabled);
	var ul = element.parentNode.children ? element.parentNode.children[0] : element.parentNode.childNodes[0];
	if (ul.nodeName.toLowerCase() === "ul") {
		var childs = element.parentNode.children || element.parentNode.childNodes;
		var tab;
		for (var i = 1, len = childs.length; i < len; i++) {
			if (childs[i] === element) {
				tab = ul.childNodes[i - 1];
			}
		}
		XsltForms_browser.setClass(tab, "xforms-disabled", disabled);
	}
};