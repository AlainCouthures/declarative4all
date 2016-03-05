/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser XsltForms_element Fleur XsltForms_idManager*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module repeat
 * @description  === "XsltForms_repeat" class ===
 * Repeat Element Class
 * * constructor function : sets specific properties
 */
		
function XsltForms_repeat(subform, id, nbsiblings, binding) {
	XsltForms_globals.counters.repeat++;
	this.init(subform, id);
	this.controlName = "repeat";
	this.nbsiblings = nbsiblings;
	this.binding = binding;
	this.index = 1;
	var el = this.element;
	this.isRepeat = true;
	this.hasBinding = true;
	this.root = XsltForms_browser.hasClass(el, "xforms-control")? el.lastChild : el;
	this.isItemset = XsltForms_browser.hasClass(el, "xforms-itemset");
}

XsltForms_repeat.prototype = new XsltForms_element();


		
/**
 * * '''dispose''' method : clears properties of this element and calls the parent dispose() method
 */

XsltForms_repeat.prototype.dispose = function() {
	this.root = null;
	XsltForms_globals.counters.repeat--;
	XsltForms_element.prototype.dispose.call(this);
};


		
/**
 * * '''setIndex''' method : sets the current index for this repeat element
 */

XsltForms_repeat.prototype.setIndex = function(index) {
	if (this.nodes.length === 0) {
		this.index = 0;
	} else if (this.index !== index) {
		var node = this.nodes[index - 1];
		if (node) {    
			XsltForms_globals.openAction("XsltForms_repeat.prototype.setIndex");
			this.index = index;
			this.element.node = node;
			XsltForms_globals.addChange(this);
			XsltForms_globals.addChange(document.getElementById(XsltForms_browser.getDocMeta(node.ownerDocument, "model")).xfElement);
			XsltForms_globals.closeAction("XsltForms_repeat.prototype.setIndex");
		}
	}
};


		
/**
 * * '''deleteNode''' method : deletes the given node within this repeat element and makes sure that the current index is still valid
 */

XsltForms_repeat.prototype.deleteNode = function(node) {
	var newNodes = [];
	var nodes = this.nodes;
	for (var i = 0, len = nodes.length; i < len; i++) {
		if (node !== nodes[i]) {
			newNodes.push(nodes[i]);
		}
	}
	this.nodes = newNodes;
	this.setIndex(this.index === nodes.length? this.index - 1 : this.index);
};


		
/**
 * * '''insertNode''' method : inserts the given node after another given node within this repeat element and updates the current index
 */

XsltForms_repeat.prototype.insertNode = function(node, nodeAfter) {
	var nodes = this.nodes;
	if (nodeAfter) {
		var newNodes = [];
		var index = 1;
		for (var i = 0, len = nodes.length; i < len; i++) {
			if (nodeAfter === nodes[i]) {
				newNodes.push(node);
				index = i + 1;
			}
			newNodes.push(nodes[i]);
		}
		this.nodes = newNodes;
		this.setIndex(index);
	} else {
		nodes.push(node);
		this.setIndex(nodes.length);
	}
};


		
/**
 * * '''build_''' method : recreates every nodes within this repeat control and sets the current index at 1
 */

XsltForms_repeat.prototype.build_ = function(ctx) {
	var nodes0 = this.evaluateBinding(this.binding, ctx);
	var nodes = [];
	var r0, r, l, child;
	for (var n = 0, ln = nodes0.length; n < ln; n++) {
		if (!XsltForms_browser.getBoolMeta(nodes0[n], "notrelevant")) {
			nodes.push(nodes0[n]);
		}
	}
	var inputids = {ids: {}, fors: {}};
	this.nodes = nodes;
	n = nodes.length;
	if (this.nbsiblings === 0) {
		r = this.root;
		while (r.firstChild.nodeType === Fleur.Node.TEXT_NODE) {
			r.removeChild(r.firstChild);
		}
		r0 = r.children ? r.children[0] : r.childNodes[0];
		XsltForms_repeat.forceOldId(r0);
		l = r.children ? r.children.length : r.childNodes.length;
		for (var i = l; i < n; i++) {
			child = r0.cloneNode(true);
			r.appendChild(child);
			XsltForms_repeat.initClone(child, inputids);
		}
		for (var j = n; j < l && r.childNodes.length > 1; j++) {
			XsltForms_globals.dispose(r.lastChild);
			r.removeChild(r.lastChild);
		}
		for (var k = 0; k < n; k++) {
			XsltForms_browser.setMeta(nodes[k], "repeat", this.element.id);
			if (r.children) {
				r.children[k].node = nodes[k];
			} else {
				r.childNodes[k].node = nodes[k];
			}
		}
	} else {
		r0 = this.root;
		XsltForms_repeat.forceOldId(r0);
		r = r0.parentNode;
		var cc = r.firstChild;
		var i0 = 0;
		while (cc) {
			if (cc === r0) {
				break;
			}
			i0++;
			cc = cc.nextSibling;
		}
		l = 1;
		var rl = r.childNodes[i0 + this.nbsiblings];
		while (rl && (rl.id === this.element.id || rl.attributes.oldid.value === this.element.id)) {
			l++;
			rl = r.childNodes[i0 + l*this.nbsiblings];
		}
		for (var ib = l; ib < n; ib++) {
			child = r0.cloneNode(true);
			r.insertBefore(child, rl);
			XsltForms_repeat.initClone(child, inputids);
			delete child.xfElement;
			var r0s = r0.nextSibling;
			for (var isb = 1; isb < this.nbsiblings; isb++, r0s = r0s.nextSibling) {
				child = r0s.cloneNode(true);
				r.insertBefore(child, rl);
				XsltForms_repeat.initClone(child, inputids);
			}
		}
		for (var jb = n; jb < l; jb++) {
			var rj = r.childNodes[i0 + (n+1)*this.nbsiblings];
			if (!(rj && (rj.id === this.element.id || rj.attributes.oldid.value === this.element.id))) {
				break;
			}
			for (var jsb = 0; jsb < this.nbsiblings; jsb++) {
				XsltForms_globals.dispose(r.children[i0 + n*this.nbsiblings]);
				r.removeChild(r.children[i0 + n*this.nbsiblings]);
			}
		}
		for (var kb = 0; kb < n; kb++) {
			XsltForms_browser.setMeta(nodes[k], "repeat", this.element.id);
			if (r.children) {
				r.children[i0 + kb*this.nbsiblings].node = nodes[kb];
			} else {
				r.childNodes[i0 + kb*this.nbsiblings].node = nodes[kb];
			}
		}
	}
	for (var ii = 0; ii < n; ii++) {
		if (this.element.node === nodes[ii]) {
			if (this.index !== ii + 1) {
				this.index = ii + 1;
				XsltForms_globals.addChange(this);
				XsltForms_globals.addChange(this.element.node.ownerDocument.model);
			}
			return;
		}
	}
	this.element.node = nodes[0];
	if (this.element.node) {
		if (this.index !== 1) {
			this.index = 1;
			XsltForms_globals.addChange(this);
			XsltForms_globals.addChange(this.element.node.ownerDocument.model);
		}
	} else {
		this.index = 0;
		if (XsltForms_globals.ready) {
			XsltForms_globals.addChange(this);
		}
	}
};


		
/**
 * * '''refresh''' method : refreshes this repeat element and the child elements if it is not an ItemSet
 */

XsltForms_repeat.prototype.refresh = function(selected) {
	var empty = this.nodes.length === 0;
	if (this.nbsiblings !== 0) {
		var n0 = this.element;
		for (var i0 = 0, l0 = this.nodes.length; i0 < l0; i0++) {
			XsltForms_browser.setClass(n0, "xforms-disabled", empty);
			for (var i1 = 0, l1 = this.nbsiblings; i1 < l1; i1++) {
				n0 = n0.nextSibling;
			}
		}
	}
	XsltForms_browser.setClass(this.element, "xforms-disabled", empty);
	if (!empty && !this.isItemset) {
		if (this.nbsiblings === 0) {
			var childs = this.root.children || this.root.childNodes;
			for (var i = 0, len = childs.length; i < len; i++) {
				var sel = selected && (this.index === i + 1);
				childs[i].selected = sel;
				XsltForms_browser.setClass(childs[i], "xforms-repeat-item-selected", sel);
			}
		}
	}
};


		
/**
 * * '''clone''' method : creates a new repeat element with the given id
 */

XsltForms_repeat.prototype.clone = function(id) { 
	return new XsltForms_repeat(this.subform, id, this.nbsiblings, this.binding, true);
};


		
/**
 * * '''initClone''' function : initializes a clone for the given id
 */

XsltForms_repeat.initClone = function(element, inputids) {
	if ("LABEL" === element.nodeName.toUpperCase() && element.getAttribute("for") !== "") {
		if (inputids.ids[element.getAttribute("for")]) {
			element.setAttribute("for", inputids.ids[element.getAttribute("for")]);
		} else {
			inputids.fors[element.getAttribute("for")] = element;
		}
	}
	var id = element.id;
	if (id) {
		XsltForms_idManager.cloneId(element);
		if ("INPUT" === element.nodeName.toUpperCase()) {
			if (inputids.fors[id]) {
				inputids.fors[id].setAttribute("for", element.id);
				delete inputids.ids[id];
			} else {
				inputids.ids[id] = element.id;
			}
		}
		element.xfElement = null;
		var oldid = element.getAttribute("oldid");
		var original = document.getElementById(oldid);
		if (!original) {
			original = XsltForms_globals.idalt[oldid];
		}
		var xf = original.xfElement;
		if (xf) {
			if (xf instanceof Array) {
				for (var ixf = 0, lenxf = xf.length; ixf < lenxf; ixf++) {
					xf[ixf].clone(element.id);
				}
			} else {
				xf.clone(element.id);
			}
		}
		var listeners = original.listeners;
		if (listeners && (!XsltForms_browser.isIE || XsltForms_browser.isIE9)) {
			for (var i = 0, len = listeners.length; i < len; i++) {
				listeners[i].clone(element);
			}
		}
	}
	var parentXF = element.parentNode.xfElement;
	if (parentXF && parentXF.isComponent && parentXF.valueElement === element) {
		if (parentXF.evaljs) {
			eval(parentXF.subjs);
			parentXF.evaljs = false;
		}
		return;
	}
	//var oldinputids = {ids: inputids.ids.slice(0), fors: inputids.fors.slice(0)};
	var next = element.firstChild;
	while (next) {
		var child = next;
		next = next.nextSibling;
		if (child.id && child.getAttribute("cloned")) {
			element.removeChild(child);
		} else {
			XsltForms_repeat.initClone(child, inputids);
		}
	}
};


		
/**
 * * '''forceOldId''' function : allows this element to have oldid attributes based on id attributes
 */

XsltForms_repeat.forceOldId = function(element) {
	var id = element.id;
	if (id) {
		if (id.substr(0, 8) === "clonedId") {
			return;
		}
		element.setAttribute("oldid", id);
	}
	var next = element.firstChild;
	while (next) {
		var child = next;
		next = next.nextSibling;
		XsltForms_repeat.forceOldId(child);
	}
};


		
/**
 * * '''selectItem''' function : set the current index at the given element within a repeat element
 */

XsltForms_repeat.selectItem = function(element) {
	var par = element.parentNode;
	if (par) {
		var repeat = par.xfElement? par : par.parentNode;
		if (repeat.xfElement) {
			var childs = par.children;
			XsltForms_browser.assert(repeat.xfElement, element.nodeName +  " - " + repeat.nodeName);
			for (var i = 0, len = childs.length; i < len; i++) {
				if (childs[i] === element) {
					repeat.xfElement.setIndex(i + 1);
					break;
				}
			}
		} else {
			var n = element;
			var d = 1;
			while (n && !n.xfElement) {
				n = n.previousSibling;
				d++;
			}
			if (n && n.xfElement && n.xfElement.nbsiblings > 0) {
				n.xfElement.setIndex(d / n.xfElement.nbsiblings);
			}
		}
	}
};