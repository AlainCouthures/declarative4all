/*eslint-env browser*/
/*globals XsltForms_element XsltForms_globals XsltForms_browser XsltForms_toggle XsltForms_class XsltForms_binding XsltForms_subform*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module group
 * @description  === "XsltForms_group" class ===
 * Group Element Class
 * * constructor function : sets specific properties
 */
	
new XsltForms_class("XsltForms_group", "HTMLElement", "xforms-group", "<xforms-label></xforms-label><xforms-alert></xforms-alert><xforms-help></xforms-help><xforms-hint></xforms-hint><xforms-body></xforms-body>");
new XsltForms_class("XsltForms_group", "HTMLElement", "xforms-switch");
XsltForms_browser.addLoadListener(new Function(
	"Array.prototype.slice.call(document.querySelectorAll('*[xforms-name=\"group\"]')).forEach(function(elt) { if (!elt.xfElement) { elt.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt); elt.xfElement = new XsltForms_group(XsltForms_subform.subforms['xsltforms-mainform'], elt); } });"
));
		
function XsltForms_group(subform, elt) {
	this.init(subform, elt);
	var binding = elt.hasAttribute("xf-ref") || elt.hasAttribute("xf-bind") ? new XsltForms_binding(subform, elt) : null;
	XsltForms_globals.counters.group++;
	this.init(subform, elt);
	this.controlName = "group";
	if (elt.localName.toLowerCase() === "xforms-switch") {
		var cells = Array.prototype.slice.call(this.element.children || this.element.childNodes);
		for (var i = 0, l = cells.length; i < l; i++) {
			var selected = cells[i].getAttribute("xf-selected");
			if (selected === "true") {
				break;
			}
		}
		if (i === l) {
			cells[0].setAttribute("xf-selected", "true");
		}
	}
	if (binding) {
		this.hasBinding = true;
		this.binding = binding;
	//} else {
	//	XsltForms_browser.setClass(this.element, "xforms-enabled", true);
	}
	this.casebinding = elt.hasAttribute("xf-caseref") ? new XsltForms_binding(subform, elt) : null;
}

XsltForms_group.prototype = new XsltForms_element();


		
/**
 * * '''dispose''' method : decrements the number of groups and calls the parent dispose() method
 */

XsltForms_group.prototype.dispose = function() {
	XsltForms_globals.counters.group--;
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
	var node = this.evaluateBinding(this.binding, ctx).head();
	this.element.node = node;
	this.depsNodesRefresh.push(node);
	if (this.casebinding) {
		var caseref = this.evaluateBinding(this.casebinding, node);
		if (caseref) {
			XsltForms_toggle.toggle(XsltForms_globals.stringValue(caseref));
		}
	}
};


		
/**
 * * '''refresh''' method : sets "xforms-disabled" CSS class
 */

XsltForms_group.prototype.refresh = function() {
	var element = this.element;
	var disabled = !element.node || XsltForms_browser.getBoolMeta(element.node, "notrelevant");
	if (disabled) {
		this.element.setAttribute("xf-notrelevant", "");
	} else {
		this.element.removeAttribute("xf-notrelevant");
	}
	//XsltForms_browser.setClass(element, "xforms-disabled", disabled);
	//var ul = element.parentNode.children ? element.parentNode.children[0] : element.parentNode.childNodes[0];
	//if (ul.nodeName.toLowerCase() === "ul") {
	//	var childs = element.parentNode.children || element.parentNode.childNodes;
	//	var tab;
	//	for (var i = 1, len = childs.length; i < len; i++) {
	//		if (childs[i] === element) {
	//			tab = ul.childNodes[i - 1];
	//		}
	//	}
	//	XsltForms_browser.setClass(tab, "xforms-disabled", disabled);
	//}
};

		
/**
 * * '''collapse''' method : expands/collapses group content
 */

XsltForms_group.prototype.collapse = function() {
	var label = this.element.children[0];
	var content = this.element.children[1];
	if (XsltForms_browser.hasClass(label, "xforms-group-label-collapsed")) {
		XsltForms_browser.setClass(label, "xforms-group-label-collapsed", false);
		XsltForms_browser.setClass(label, "xforms-group-label-expanded", true);
		XsltForms_browser.setClass(content, "xforms-disabled", false);
	} else {
		XsltForms_browser.setClass(label, "xforms-group-label-collapsed", true);
		XsltForms_browser.setClass(label, "xforms-group-label-expanded", false);
		XsltForms_browser.setClass(content, "xforms-disabled", true);
	}
};
