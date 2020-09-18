/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser XsltForms_control XsltForms_element XsltForms_class XsltForms_subform*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module item
 * @description  === "XsltForms_item" class ===
 * Item Element  Class
 * * constructor function : initializes specific properties and initializes focus and blur event management
 */
		
new XsltForms_class("XsltForms_item", "HTMLElement", "xforms-item", "<xforms-body></xforms-body><xforms-label></xforms-label>");

function XsltForms_item(subform, elt, clone) {
	var bindingL, bindingV, copyBinding;
	XsltForms_globals.counters.item++;
	this.init(subform, elt);
	this.controlName = "item";
	if (bindingL || bindingV) {
		this.hasBinding = true;
		this.bindingL = bindingL;
		this.bindingV = bindingV;
		this.copyBinding = copyBinding;
	//} else {
	//	XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
	/*
	var element = this.element;
	if (element.nodeName.toLowerCase() !== "option") {
		this.input = XsltForms_browser.isXhtml ? element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input")[0] : element.getElementsByTagName("input")[0];
		this.input.name = XsltForms_control.getXFElement(this.element).element.id;
		XsltForms_browser.events.attach(this.input, "focus", XsltForms_control.focusHandler);
		XsltForms_browser.events.attach(this.input, "blur", XsltForms_control.blurHandler);
		this.label = XsltForms_browser.isXhtml ? element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "label")[0] : element.getElementsByTagName("label")[0];
	}
	*/
}

XsltForms_item.prototype = new XsltForms_element();


		
/**
 * * '''clone''' method : creates a new item control with the given id
 */

XsltForms_item.prototype.clone = function(id) { 
	return new XsltForms_item(this.subform, id, this.bindingL, this.bindingV, this.copyBinding);
};


		
/**
 * * '''dispose''' method : clears properties of this element and calls the parent dispose() method
 */

XsltForms_item.prototype.dispose = function() {
	this.input = null;
	this.label = null;
	XsltForms_globals.counters.item--;
	XsltForms_element.prototype.dispose.call(this);
};


		
/**
 * * '''build_''' method : specific build method according to label and value bindings
 */

XsltForms_item.prototype.build_ = function(ctx) {
	var result, element = this.element;
	var xf = element.parentNode.xfElement;
	if (xf && xf.isRepeat) {
		this.ctx = ctx = element.node;
	} else {
		element.node = ctx;
	}
	if (this.bindingL) {
		result = this.evaluateBinding(this.bindingL, ctx);
		if (typeof result === "object") {
			element.nodeL = result[0];
			element.valueL = null;
			this.depsNodesRefresh.push(element.nodeL);
		} else {
			element.nodeL = null;
			element.valueL = result;
		}
	}
	if (this.bindingV) {
		result = this.evaluateBinding(this.bindingV, ctx);
		if (typeof result === "object") {
			element.nodeV = result[0];
			element.valueV = null;
			this.depsNodesRefresh.push(element.nodeV);
		} else {
			element.nodeV = null;
			element.valueV = result;
		}
	}
	var nodeCopy = this.copyBinding ? this.evaluateBinding(this.copyBinding, ctx)[0] : null;
	if (this.copyBinding && nodeCopy) {
		element.parentNode.parentNode.parentNode.parentNode.xfElement.hasCopy = true;
		this.depsNodesRefresh.push(nodeCopy);
		try {
			element.copy = XsltForms_browser.saveNode(nodeCopy, "application/xml");
		} catch(e3) {
		}
	}
};


		
/**
 * * '''refresh''' method : refreshes the label and the value for this item control depending whether it has a rendering as option or not
 */

XsltForms_item.prototype.refresh = function() {
	var element = this.element;
	//XsltForms_browser.setClass(element, "xforms-disabled", false);
	if (element.nodeName.toLowerCase() === "option") {
		if (element.nodeL) {
			try { 
				element.text = XsltForms_browser.getValue(element.nodeL, true);
			} catch(e) {
			}
		} else if (element.valueL) {
			element.text = element.valueL;
		}
		if (element.nodeV) {
			try {
				element.value = XsltForms_browser.getValue(element.nodeV);
			} catch(e2) {
			}
		} else if (element.valueV) {
			element.value = element.valueV;
		}
	} else {
		if (element.nodeL) {
			XsltForms_browser.setValue(this.label, XsltForms_browser.getValue(element.nodeL, true));
		} else if (element.valueL) {
			XsltForms_browser.setValue(this.label, element.valueL);
		}
		if (element.nodeV) {
			this.input.value = XsltForms_browser.getValue(element.nodeV);
		} else if (element.valueV) {
			this.input.value = element.valueV;
		} else if (element.copy) {
			this.input.value = this.input.copy = element.copy;
		}
	}
};


		
/**
 * * '''click''' method : manages the click event according to the item control type
 */

XsltForms_item.prototype.click = function (target) {
	var input = this.input;
	if (input) {
		var xf = XsltForms_control.getXFElement(this.element);
		if (!xf.element.node.readonly && target === input) {
			xf.itemClick(input.value);
		}
	}
};