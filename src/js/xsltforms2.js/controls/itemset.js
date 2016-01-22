/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_element XsltForms_idManager XsltForms_browser Fleur*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module itemset
 * @description  === "XsltForms_itemset" class ===
 * ItemSet Element  Class
 * * constructor function : initializes specific properties
 */
		
function XsltForms_itemset(subform, id, nodesetBinding, labelBinding, valueBinding, copyBinding) {
	XsltForms_globals.counters.itemset++;
	this.init(subform, id);
	this.controlName = "itemset";
	this.nodesetBinding = nodesetBinding;
	this.labelBinding = labelBinding;
	this.valueBinding = valueBinding;
	this.copyBinding = copyBinding;
	this.hasBinding = true;
}

XsltForms_itemset.prototype = new XsltForms_element();


		
/**
 * * '''build_''' method : specific build method with the corresponding clones creation
 */

XsltForms_itemset.prototype.build_ = function(ctx) {
	if (this.element.getAttribute("cloned")) {
		return;
	}
	this.nodes = this.evaluateBinding(this.nodesetBinding, ctx);
	var next = this.element;
	var parentNode = next.parentNode;
	var l = this.nodes.length;
	var oldNode = next;
	var listeners = next.listeners;
	var cont = 1;
	while (next) {
		next = next.nextSibling;
		if (next) {
			if (next.nodeType === Fleur.Node.ELEMENT_NODE) {
				if (next.getAttribute("cloned")) {
					if (cont >= l) {
						next.listeners = null;
						parentNode.removeChild(next);
						next = oldNode;
					} else {
						next.node = this.nodes[cont];
						this.refresh_(next, cont++);
						oldNode = next;
					}
				}
			} else {
				var n = next.previousSibling;
				next.parentNode.removeChild(next);
				next = n;
			}
		} else {
			for (var i = cont; i < l; i++) {
				var node = this.element.cloneNode(true);
				node.setAttribute("cloned", "true");
				XsltForms_idManager.cloneId(node);
				node.node = this.nodes[i];
				parentNode.appendChild(node);
				this.refresh_(node, i);
				if (listeners && !XsltForms_browser.isIE) {
					for (var j = 0, len = listeners.length; j < len; j++) {
						listeners[j].clone(node);
					}
				}
			}
			break;
		}
	}
	if (l > 0) {
		this.element.node = this.nodes[0];
		this.refresh_(this.element, 0);
	} else {
		this.element.value = "\xA0";
		this.element.text = "\xA0";
	}
};


		
/**
 * * '''refresh''' method : sets "xforms-disabled" CSS class
 */

XsltForms_itemset.prototype.refresh = function() {
	var parentNode = this.element.parentNode;
	var i = 0;
	while (parentNode.childNodes[i] !== this.element) {
		i++;
	}
	for (var j = 0, len = this.nodes.length; j < len || j === 0; j++) {
		XsltForms_browser.setClass(parentNode.childNodes[i+j], "xforms-disabled", this.nodes.length === 0);
	}
};


		
/**
 * * '''clone''' method : creates a new itemset control with the given id
 */

XsltForms_itemset.prototype.clone = function(id) {
	return new XsltForms_itemset(this.subform, id, this.nodesetBinding, this.labelBinding, this.valueBinding, this.copyBinding);
};


		
/**
 * * '''dispose''' method : decrements the number of itemsets and calls the parent dispose() method
 */

XsltForms_itemset.prototype.dispose = function() {
	XsltForms_globals.counters.itemset--;
	XsltForms_element.prototype.dispose.call(this);
};


		
/**
 * * '''refresh_''' method : refreshes this ItemSet Control at a given position
 */

XsltForms_itemset.prototype.refresh_ = function(element, cont) {
	var result, ctx = this.nodes[cont], nodeLabel, nodeValue;
	result = this.evaluateBinding(this.labelBinding, ctx);
	if (typeof result === "object") {
		nodeLabel = result[0];
		this.depsNodesRefresh.push(nodeLabel);
		try {
			element.text = XsltForms_browser.getValue(nodeLabel, true);
		} catch(e) {
		}
	} else {
		element.text = result;
	}
	result = this.valueBinding ? this.evaluateBinding(this.valueBinding, ctx) : null;
	if (this.valueBinding && result) {
		if (typeof result === "object") {
			nodeValue = result[0];
			this.depsNodesRefresh.push(nodeValue);
			try {
				element.value = XsltForms_browser.getValue(nodeValue);
			} catch(e2) {
			}
		} else {
			element.value = result;
		}
	}
	var nodeCopy = this.copyBinding ? this.evaluateBinding(this.copyBinding, ctx)[0] : null;
	if (this.copyBinding && nodeCopy) {
		this.depsNodesRefresh.push(nodeCopy);
		try {
			element.value = element.copy = XsltForms_browser.saveNode(nodeCopy, "application/xml");
		} catch(e3) {
		}
	}
};