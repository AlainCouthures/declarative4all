/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser XsltForms_element Fleur XsltForms_idManager XsltForms_class XsltForms_subform XsltForms_binding XsltForms_classes XsltForms_collection XsltForms_avt*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module repeat
 * @description  === "XsltForms_repeat" class ===
 * Repeat Element Class
 * * constructor function : sets specific properties
 */
		
new XsltForms_class("XsltForms_repeat", "HTMLElement", "xforms-repeat");
XsltForms_browser.addLoadListener(new Function(
	"Array.prototype.slice.call(document.querySelectorAll('*[xf-repeat-ref]')).forEach(function(elt) { if (!elt.xfElement) { elt.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt); elt.xfElement = new XsltForms_repeat(XsltForms_subform.subforms['xsltforms-mainform'], elt); } });"
));
XsltForms_browser.addLoadListener(new Function(
	"Array.prototype.slice.call(document.querySelectorAll('*[xf-repeat-bind]')).forEach(function(elt) { if (!elt.xfElement) { elt.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt); elt.xfElement = new XsltForms_repeat(XsltForms_subform.subforms['xsltforms-mainform'], elt); } });"
));
XsltForms_browser.addLoadListener(new Function(
	"Array.prototype.slice.call(document.querySelectorAll('*[data-xf-repeat-ref]')).forEach(function(elt) { if (!elt.xfElement) { elt.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt); elt.xfElement = new XsltForms_repeat(XsltForms_subform.subforms['xsltforms-mainform'], elt); } });"
));
XsltForms_browser.addLoadListener(new Function(
	"Array.prototype.slice.call(document.querySelectorAll('*[data-xf-repeat-bind]')).forEach(function(elt) { if (!elt.xfElement) { elt.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt); elt.xfElement = new XsltForms_repeat(XsltForms_subform.subforms['xsltforms-mainform'], elt); } });"
));
XsltForms_browser.addLoadListener(new Function(
	"Array.prototype.slice.call(document.querySelectorAll('*[xforms-name=\"repeat\"]')).forEach(function(elt) { if (!elt.xfElement) { elt.xfIndex = XsltForms_collection.length; XsltForms_collection.push(elt); elt.xfElement = new XsltForms_repeat(XsltForms_subform.subforms['xsltforms-mainform'], elt); } });"
));

function XsltForms_repeat(subform, elt) {
	this.init(subform, elt);
	this.controlName = "repeat";
	this.index = 1;
	this.isRepeat = true;
	this.hasBinding = true;
	if (elt.localName.toLowerCase() === "xforms-repeat" || elt.getAttribute("xforms-name") === "repeat") {
		this.binding = elt.hasAttribute("xf-ref") || elt.hasAttribute("xf-bind") ? new XsltForms_binding(subform, elt) : null;
		this.nbsiblings = 0;
		//var el = this.element;
		this.root = elt;
		this.isItemset = false;
		if ((!elt.firstChild.localName || elt.firstChild.localName.toLowerCase() !== "xforms-repeat-item") && (!elt.firstChild.getAttribute || elt.firstChild.getAttribute("xforms-name") !== "repeat-item")) {
			var ritem;
			if (elt.localName.toLowerCase() === "xforms-repeat") {
				ritem = document.createElement("xforms-repeat-item");
			} else {
				ritem = document.createElementNS(elt.namespaceURI, elt.localName);
				ritem.setAttribute("xforms-name", "repeat-item");
			}
			var cells = Array.prototype.slice.call(this.element.childNodes);
			for (var i = 0, l = cells.length; i < l; i++) {
				ritem.appendChild(cells[i]);
			}
			ritem.varScope = elt.varScope;
			elt.varScope = null;
			elt.appendChild(ritem);
		}
	} else {
		if (elt.hasAttribute("xf-repeat-ref") || elt.hasAttribute("xf-repeat-bind")) {
			this.binding = new XsltForms_binding(subform, elt, "xf-repeat-ref");
		} else if (elt.hasAttribute("data-xf-repeat-ref") || elt.hasAttribute("data-xf-repeat-bind")) {
			this.binding = new XsltForms_binding(subform, elt, "data-xf-repeat-ref");
		} else {
			this.binding = null;
		}
		this.nbsiblings = 0;
		this.root = elt;
	}
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
	var i, len, nodes = this.nodes;
	if (nodeAfter) {
		var repeatAfter = null;
		for (i = 0, len = nodes.length; i < len && repeatAfter === null; i++) {
			repeatAfter = nodeAfter;
			while (repeatAfter !== null && repeatAfter !== nodes[i]) {
				repeatAfter = repeatAfter.nextSibling;
			}
		}
	}
	if (repeatAfter) {
		var newNodes = [];
		var index = 1;
		for (i = 0, len = nodes.length; i < len; i++) {
			if (repeatAfter === nodes[i]) {
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
	if (nodes0.isSingle()) {
		nodes[0] = nodes0;
	} else {
		for (let n = 0, ln = nodes0.childNodes.length; n < ln; n++) {
			if (!XsltForms_browser.getBoolMeta(nodes0.childNodes[n], "notrelevant")) {
				nodes.push(nodes0.childNodes[n]);
			}
		}
	}
	var inputids = {ids: {}, fors: {}};
	this.nodes = nodes;
	let n = nodes.length;
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
			Array.prototype.slice.call(child.querySelectorAll(".cke")).forEach(function(n) { n.parentNode.removeChild(n); });
			r.appendChild(child);
			XsltForms_repeat.initClone(this.subform, child, inputids);
		}
		for (var j = n; j < l && r.childNodes.length > 1; j++) {
			XsltForms_globals.dispose(r.lastChild);
			r.removeChild(r.lastChild);
		}
		for (var k = 0; k < n; k++) {
			XsltForms_browser.setMeta(nodes[k], "repeat", String(this.element.xfIndex));
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
			Array.prototype.slice.call(child.querySelectorAll(".cke")).forEach(function(n) { n.parentNode.removeChild(n); });
			r.insertBefore(child, rl);
			XsltForms_repeat.initClone(this.subform, child, inputids);
			delete child.xfElement;
			var r0s = r0.nextSibling;
			for (var isb = 1; isb < this.nbsiblings; isb++, r0s = r0s.nextSibling) {
				child = r0s.cloneNode(true);
				r.insertBefore(child, rl);
				XsltForms_repeat.initClone(this.subform, child, inputids);
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
			XsltForms_browser.setMeta(nodes[kb], "repeat", String(this.element.xfIndex));
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
	//if (this.nbsiblings !== 0) {
	//	var n0 = this.element;
	//	for (var i0 = 0, l0 = this.nodes.length; i0 < l0; i0++) {
	//		XsltForms_browser.setClass(n0, "xforms-disabled", empty);
	//		for (var i1 = 0, l1 = this.nbsiblings; i1 < l1; i1++) {
	//			n0 = n0.nextSibling;
	//		}
	//	}
	//}
	//XsltForms_browser.setClass(this.element, "xforms-disabled", empty);
	if (!empty) {
		this.element.setAttribute("xf-bound", "");
	} else {
		this.element.removeAttribute("xf-bound");
	}
	if (!empty && !this.isItemset) {
		if (this.nbsiblings === 0) {
			var childs = this.root.children || this.root.childNodes;
			for (var i = 0, len = childs.length; i < len; i++) {
				var sel = selected && (this.index === i + 1);
				childs[i].selected = sel;
				//XsltForms_browser.setClass(childs[i], "xforms-repeat-item-selected", sel);
				childs[i].setAttribute("xf-selected", String(sel));
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

XsltForms_repeat.initClone = function(subform, element, inputids) {
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
		var oldid = element.getAttribute("oldid");
		var original = document.getElementById(oldid);
		if (!original) {
			original = XsltForms_globals.idalt[oldid];
		}
	}
	var ename = element.nodeName.toLowerCase();
	var xfclass = XsltForms_classes[ename];
	if (xfclass || (element.nodeType === Fleur.Node.ELEMENT_NODE && element.hasAttribute("xf-avt"))) {
		element.xfElement = null;
	}
	if (xfclass) {
		xfclass.classbinding(subform, element);
	}
	if (element.nodeType === Fleur.Node.ELEMENT_NODE && element.hasAttribute("xforms-name") && XsltForms_classes["xforms-" + element.getAttribute("xforms-name")]) {
		element.xfElement = eval("new " + XsltForms_classes["xforms-" + element.getAttribute("xforms-name")].className + "(subform, element)");
		element.xfIndex = XsltForms_collection.length;
		XsltForms_collection.push(element);
	}
	if (element.nodeType === Fleur.Node.ELEMENT_NODE && (element.hasAttribute("xf-repeat-ref") || element.hasAttribute("xf-repeat-bind"))) {
		element.xfElement = new XsltForms_repeat(subform, element);
		element.xfIndex = XsltForms_collection.length;
		XsltForms_collection.push(element);
	}
	if (element.nodeType === Fleur.Node.ELEMENT_NODE && element.hasAttribute("xf-avt")) {
		element.xfIndex = XsltForms_collection.length;
		XsltForms_collection.push(element);
		Array.prototype.slice.call(element.attributes).filter(function(a) {return a.nodeName.startsWith('xf-template-');}).forEach(function(a) { new XsltForms_avt(subform, element, a.nodeName.substr(12)); });
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
			XsltForms_repeat.initClone(subform, child, inputids);
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