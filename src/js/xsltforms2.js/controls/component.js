/*eslint-env browser*/
/*globals XsltForms_engine XsltForms_browser XsltForms_control*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module component
 * @description  === "XsltForms_component" class ===
 * Component Control  Class
 * * constructor function : initializes specific properties
 */
		
function XsltForms_component(subform, id, valoff, binding, href) {
	XsltForms_engine.counters.component++;
	this.init(subform, id);
	this.valoff = valoff;
	var children = this.element.children || this.element.childNodes;
	if (children.length !== 0) {
		var cells = children;
		this.valueElement = cells[valoff];
	} else {
		this.valueElement = this.element;
	}
	this.hasBinding = true;
	this.binding = binding;
	this.resource = href;
	this.isComponent = true;
	if (this.binding && this.binding.type) {
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
	//this.subformid = "xsltforms-subform-" + XsltForms_engine.nbsubforms;
	var req = null;
	var method = "get";
	// var evcontext = {"method": method, "resource-uri": href};
	try {
		req = XsltForms_browser.openRequest(method, href, false);
		XsltForms_browser.debugConsole.write("Load Component " + href);
		req.send(null);
		if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
			return;
		}
		var resp = req.responseText;
		var piindex = resp.indexOf("<?xml-stylesheet", 0);
		while ( piindex !== -1) {
			var xslhref = resp.substr(piindex, resp.substr(piindex).indexOf("?>")).replace(/^.*href=\"([^\"]*)\".*$/, "$1");
			resp = XsltForms_browser.transformText(resp, xslhref, false);
			piindex = resp.indexOf("<?xml-stylesheet", 0);
		}
		var sp = XsltForms_engine.stringSplit(resp, "XsltForms_MagicSeparator");
		var subbody, subjs;
		var targetelt = this.valueElement;
		if (sp.length === 1) {
			subbody = resp;
		} else {
			subjs = "/* xsltforms-subform-" + XsltForms_engine.nbsubforms + " " + sp[2] + " xsltforms-subform-" + XsltForms_engine.nbsubforms + " */";
			var imain = subjs.indexOf('"xsltforms-mainform"');
			var targetsubform = targetelt.xfSubform;
			if (targetsubform) {
				targetsubform.dispose();
			}
			subjs = '(function(){var xsltforms_subform_eltid = "' + id + '";var xsltforms_parentform = XsltForms_subform.subforms["' + this.subform.id + '"];' + subjs.substring(0, imain) + '"xsltforms-subform-' + XsltForms_engine.nbsubforms + '"' + subjs.substring(imain + 20) + "})();";
			imain = subjs.indexOf('"xsltforms-mainform-instance-default"');
			while (imain !== -1) {
				subjs = subjs.substring(0, imain) + '"xsltforms-subform-' + XsltForms_engine.nbsubforms + '-instance-default"' + subjs.substring(imain + 37);
				imain = subjs.indexOf('"xsltforms-mainform-instance-default"');
			}
			subbody = "<!-- xsltforms-subform-" + XsltForms_engine.nbsubforms + " " + sp[4] + " xsltforms-subform-" + XsltForms_engine.nbsubforms + " -->";
			imain = subbody.indexOf(' id="xsltforms-mainform');
			while (imain !== -1) {
				subbody = subbody.substring(0, imain) + ' id="xsltforms-subform-' + XsltForms_engine.nbsubforms + subbody.substring(imain + 23);
				imain = subbody.indexOf(' id="xsltforms-mainform');
			}
		}
		targetelt.innerHTML = subbody;
		targetelt.hasXFElement = null;
		var parentNode = targetelt.parentNode;
		while (parentNode) {
			if (parentNode.hasXFElement !== false) {
				break;
			}
			parentNode.hasXFElement = null;
			parentNode = parentNode.parentNode;
		}
		if (sp.length !== 1) {
			XsltForms_engine.componentLoads.push(subjs);
			this.subjs = subjs;
			this.evaljs = true;
		}
		XsltForms_browser.setClass(targetelt, "xforms-subform-loaded", true);
		XsltForms_engine.nbsubforms++;
	} catch(e2) {
		XsltForms_browser.debugConsole.write(e2.message || e2);
	}
}

//XsltForms_component.prototype = new XsltForms_control();


		
/**
 * * '''clone''' method : creates a new output control with the given id
 */

XsltForms_component.prototype.clone = function(id) { 
	return new XsltForms_component(this.subform, id, this.valoff, this.binding, this.resource);
};


		
/**
 * * '''dispose''' method : clears properties of this control and calls the parent dispose() method
 */

XsltForms_component.prototype.dispose = function() {
	this.valueElement = null;
	XsltForms_engine.counters.component--;
	XsltForms_control.prototype.dispose.call(this);
};


		
/**
 * * '''blur''' method : empty method
 */

XsltForms_component.prototype.blur = function () { };


		
/**
 * * '''setValue''' method : sets the value of this component control
 * @callback
 */

XsltForms_component.prototype.setValue = function(value) {
	XsltForms_browser.forEach(this.valueElement.children[0].xfElement.subform.binds, "propagate");
};