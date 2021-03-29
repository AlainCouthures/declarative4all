/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_schema XsltForms_binding XsltForms_element XsltForms_coreElement XsltForms_browser XsltForms_exprContext XsltForms_class XsltForms_subform XsltForms_element_depsId:true XsltForms_xpath XsltForms_MIPBinding XsltForms_mipbinding Fleur*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module bind
 * @description  === "XsltForms_bind" class ===
 * Model Binding Class
 * * constructor function : resolve all the properties and attach this object to the model
 */
		
new XsltForms_class("XsltForms_bind", "HTMLElement", "xforms-bind");

function XsltForms_bind(subform, elt) {
	//if (document.getElementById(id)) {
	//	return;
	//}
	var parentBind = elt.parentNode.xfElement;
	var model = parentBind.model || parentBind;
	var type = elt.getAttribute("xf-type");
	if (type === "xsd:ID") {
		XsltForms_globals.IDstr = elt.getAttribute("xf-ref").split('/').pop();
	}
	this.init(subform, elt);
	this.model = model;
	this.type = type ? XsltForms_schema.getType(type) : null;
	if (!elt.hasAttribute("xf-ref")) {
		elt.setAttribute("xf-ref", ".");
	}
	this.nodeset = elt.getAttribute("xf-ref");
	this.readonly = elt.hasAttribute("xf-readonly") ? new XsltForms_mipbinding(subform, elt, "xf-readonly", "xsd:boolean", model) : null;
	this.required = elt.hasAttribute("xf-required") ? new XsltForms_mipbinding(subform, elt, "xf-required", "xsd:boolean", model) : null;
	this.relevant = elt.hasAttribute("xf-relevant") ? new XsltForms_mipbinding(subform, elt, "xf-relevant", "xsd:boolean", model) : null;
	this.calculate = elt.hasAttribute("xf-calculate") ? new XsltForms_mipbinding(subform, elt, "xf-calculate", "xsd:string", model) : null;
	this.constraint = elt.hasAttribute("xf-constraint") ? new XsltForms_mipbinding(subform, elt, "xf-constraint", "xsd:boolean", model) : null;
	this.changed = elt.hasAttribute("xf-changed") ? new XsltForms_mipbinding(subform, elt, "xf-changed", "xsd:string", model) : null;
	this.meta = {};
	var metas = this.meta;
	Array.prototype.slice.call(elt.attributes).forEach(function(attr) {
		if (attr.nodeName.startsWith("meta-")) {
			metas[attr.nodeName.substr(5)] = new XsltForms_mipbinding(subform, elt, attr.nodeName, "xsd:anyAtomicType", model);
		}
	});
	this.depsNodes = [];
	this.depsElements = [];
	this.nodes = [];
	this.binds = [];
	this.binding = new XsltForms_binding(subform, elt);
	parentBind.addBind(this);
	subform.binds.push(this);
	this.depsId = XsltForms_element_depsId++;
}

XsltForms_bind.prototype = new XsltForms_coreElement();

XsltForms_bind.prototype.addBind = function(bind) {
	this.binds.push(bind);
};

XsltForms_bind.prototype.clear = function() {
	this.depsNodes.length = 0;
	this.depsElements.length = 0;
	this.nodes.length = 0;
	XsltForms_browser.forEach(this.binds, "clear");
};

		
/**
 * * '''refresh''' method : completely evaluates and refreshes this binding
 */

XsltForms_bind.prototype.refresh = function(ctx, index) {
	if (!index) {
		for (var i = 0, len = this.depsNodes.length; i < len; i++) {
			XsltForms_browser.rmValueMeta(this.depsNodes[i], "depfor", this.depsId);
		}
		this.clear();
	}
	ctx = ctx || (this.model ? this.model.getInstanceDocument() ? this.model.getInstanceDocument().documentElement : null : null);
	XsltForms_browser.copyArray(this.binding.bind_evaluate(this.subform, ctx, {}, this.depsNodes, this.depsId, this.depsElements).toArray(), this.nodes);
	var el = this.element;
	for (var i2 = 0, len2 = this.nodes.length; i2 < len2; i2++) {
		var node = this.nodes[i2];
		var bindids = XsltForms_browser.getMeta(node, "bind");
		if (!bindids) {
			XsltForms_browser.setMeta(node, "bind", String(this.element.xfIndex));
		} else {
			var bindids2 = " " + bindids + " ";
			if (bindids2.indexOf(" " + this.element.xfIndex + " ") === -1) {
				XsltForms_browser.setMeta(node, "bind", bindids + " " + this.element.xfIndex);
			}
		}
		if (this.type) {
			if (XsltForms_browser.getMeta(node, "schemaType")) {
				XsltForms_globals.error(el, "xforms-binding-exception", "Type especified in xsi:type attribute");
			} else {
				var typename = this.type.name;
				var ns = this.type.nsuri;
				var ns_li = Fleur.XPathNSResolver_default.uri.lastIndexOf(ns);
				if (ns_li !== -1) {
					typename = Fleur.XPathNSResolver_default.pf[ns_li] + ":" + typename;
				}
				XsltForms_browser.setType(node, typename);
			}
		}
		for (var j = 0, len1 = el.children.length; j < len1; j++) {
			if (el.children[j].xfElement && el.children[j].xfElement.refresh) {
				el.children[j].xfElement.refresh(node, i2);
			}
		}
	}
};


		
/**
 * * '''recalculate''' method : just recalculates this binding
 */

XsltForms_bind.prototype.recalculate = function() {
	var el = this.element;
	if (this.calculate) {
		for (var i = 0, len = this.nodes.length; i < len; i++) {
			var node = this.nodes[i];
			var ctx = new XsltForms_exprContext(this.subform, node, i + 1, this.nodes);
			var value = XsltForms_globals.stringValue(this.calculate.evaluate(ctx, node));
			value = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").normalize(value);
			XsltForms_browser.setValue(node, value);
			this.model.addChange(node);
			XsltForms_browser.debugConsole.write("Calculate " + node.nodeName + " " + value);
		}
	}
	for (var j = 0, len1 = el.children.length; j < len1; j++) {
		if (el.children[j].xfElement) {
			el.children[j].xfElement.recalculate();
		}
	}
};

		
/**
 * * '''propagate''' method : propagate change to component content
 */

XsltForms_bind.prototype.propagate = function() {
	var el = this.element;
	if (this.changed) {
		for (var i = 0, len = this.nodes.length; i < len; i++) {
			var node = this.nodes[i];
			var ctx = new XsltForms_exprContext(this.subform, node, i + 1, this.nodes);
			var value = XsltForms_globals.stringValue(this.changed.evaluate(ctx, node));
			value = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").normalize(value);
			XsltForms_browser.setValue(node, value);
			//this.model.addChange(node);
			XsltForms_browser.debugConsole.write("Propagate " + node.nodeName + " " + value);
		}
	}
	for (var j = 0, len1 = el.children.length; j < len1; j++) {
		if (el.children[j].xfElement) {
			el.children[j].xfElement.propagate();
		}
	}
};