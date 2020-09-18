/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_idManager XsltForms_browser XsltForms_xmlevents XsltForms_repeat Fleur XsltForms_class XsltForms_subform*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module unload
 * @description  === "XsltForms_unload" class ===
 * Unload Action Class
 * * constructor function : stores specific properties
 */
		
new XsltForms_class("XsltForms_unload", "HTMLElement", "xforms-unload");

function XsltForms_unload(subform, elt) {
	this.subform = subform;
	this.targetid = elt.getAttribute("xf-targetid");
	this.init(elt);
}

XsltForms_unload.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : unload the targeted subform
 * @callback
 */

XsltForms_unload.prototype.run = function(element, ctx) {
	var targetid = this.targetid || this.subform.eltid;
	var targetelt = XsltForms_idManager.find(targetid);
	if (targetelt.xfSubform) {
		targetelt.xfSubform.dispose();
	}
	targetelt.xfSubform = null;
	var targetxf = targetelt.xfElement;
	if (targetxf) {
		targetelt = targetelt.children[targetelt.children.length - 1];
	}
	targetelt.innerHTML = "";
	/*
	var node = targetelt.firstChild;
	alert("before " + (node.remove? "remove" : "removeChild"));
	while (node = targetelt.firstChild) {
		if (node.remove) {
			node.remove();
		} else {
			targetelt.removeChild(node);
		}
		node = null;
	}
	alert("after");
	*/
	targetelt.hasXFElement = null;
	XsltForms_browser.setClass(targetelt, "xforms-subform-loaded", false);
	if (targetxf) {
		XsltForms_xmlevents.dispatch(targetxf, "xforms-unload-done");
	}
	XsltForms_browser.debugConsole.write("unload-done");
};

		
/**
 * * '''subform''' method : unloads a subform directly from Javascript instruction
 */

XsltForms_unload.subform = function(targetid, ref) {
	if (ref) {
		var parentNode = ref;
		while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
			if (parentNode.localName.toLowerCase() === "xforms-repeat-item" || parentNode.getAttribute("xforms-name") === "repeat-item") {
				XsltForms_repeat.selectItem(parentNode);
			}
			parentNode = parentNode.parentNode;
		}
	}
	var targetelt = XsltForms_idManager.find(targetid);
	var subform = null;
	parentNode = targetelt;
	while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
		if (parentNode.xfSubform) {
			subform = parentNode.xfSubform;
			break;
		}
		parentNode = parentNode.parentNode;
	}
	var a = new XsltForms_unload(subform, targetid);
	a.run();
};