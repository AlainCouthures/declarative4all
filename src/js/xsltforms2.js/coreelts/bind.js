/*eslint-env browser*/
/*globals XsltForms_engine XsltForms_schema XsltForms_binding XsltForms_element XsltForms_coreElement XsltForms_browser XsltForms_exprContext*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module bind
 * @description  === "XsltForms_bind" class ===
 * Model Binding Class
 * * constructor function : resolve all the properties and attach this object to the model
 */
		
function XsltForms_bind(subform, id, parentBind, nodeset, type, readonly, required, relevant, calculate, constraint, changed) {
	if (document.getElementById(id)) {
		return;
	}
	var model = parentBind.model || parentBind;
	if (type === "xsd:ID") {
		XsltForms_engine.IDstr = nodeset.split('/').pop();
	}
	this.init(subform, id, parentBind, "xforms-bind");
	this.model = model;
	this.type = type ? XsltForms_schema.getType(type) : null;
	this.nodeset = nodeset;
	this.readonly = readonly;
	this.required = required;
	this.relevant = relevant;
	this.calculate = calculate;
	this.constraint = constraint;
	this.changed = changed;
	this.depsNodes = [];
	this.depsElements = [];
	this.nodes = [];
	this.binds = [];
	this.binding = new XsltForms_binding(null, this.nodeset);
	parentBind.addBind(this);
	subform.binds.push(this);
	this.depsId = XsltForms_element.depsId++;
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
	XsltForms_browser.copyArray(this.binding.bind_evaluate(this.subform, ctx, {}, this.depsNodes, this.depsId, this.depsElements), this.nodes);
	var el = this.element;
	for (var i2 = 0, len2 = this.nodes.length; i2 < len2; i2++) {
		var node = this.nodes[i2];
		var bindids = XsltForms_browser.getMeta(node, "bind");
		if (!bindids) {
			XsltForms_browser.setMeta(node, "bind", this.element.id);
		} else {
			var bindids2 = " "+bindids+" ";
			if (bindids2.indexOf(" "+this.element.id+" ") === -1) {
				XsltForms_browser.setMeta(node, "bind", bindids+" "+this.element.id);
			}
		}
		if (this.type) {
			if (XsltForms_browser.getMeta(node, "schemaType")) {
				XsltForms_engine.error(el, "xforms-binding-exception", "Type especified in xsi:type attribute");
			} else {
				var typename = this.type.name;
				var ns = this.type.nsuri;
				for (var key in XsltForms_schema.prefixes) {
					if (XsltForms_schema.prefixes.hasOwnProperty(key)) {
						if (XsltForms_schema.prefixes[key] === ns) {
							typename = key + ":" + typename;
							break;
						}
					}
				}
				XsltForms_browser.setType(node, typename);
			}
		}
		for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
			el.childNodes[j].xfElement.refresh(node, i2);
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
			var value = XsltForms_engine.stringValue(this.calculate.evaluate(ctx, node));
			value = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").normalize(value);
			XsltForms_browser.setValue(node, value);
			this.model.addChange(node);
			XsltForms_browser.debugConsole.write("Calculate " + node.nodeName + " " + value);
		}
	}
	for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
		el.childNodes[j].xfElement.recalculate();
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
			var value = XsltForms_engine.stringValue(this.changed.evaluate(ctx, node));
			value = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").normalize(value);
			XsltForms_browser.setValue(node, value);
			//this.model.addChange(node);
			XsltForms_browser.debugConsole.write("Propagate " + node.nodeName + " " + value);
		}
	}
	for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
		el.childNodes[j].xfElement.propagate();
	}
};