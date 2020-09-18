/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_globals XsltForms_browser XsltForms_xmlevents XsltForms_class XsltForms_subform XsltForms_binding*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module dispatch
 * @description  === "XsltForms_dispatch" class ===
 * Dispatch Action Class
 * * constructor function : stores specific properties
 */
		
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-dispatch");
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-hide");
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-rebuild");
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-recalculate");
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-refresh");
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-reset");
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-revalidate");
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-send");
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-setfocus");
new XsltForms_class("XsltForms_dispatch", "HTMLElement", "xforms-show");

function XsltForms_dispatch(subform, elt) {
	switch(elt.localName.toLowerCase()) {
		case "xforms-dispatch":
			var properties = {};
			var targetid, name, delay;
			Array.prototype.slice.call(elt.children).forEach(function(n) {
				switch(n.localName.toLowerCase()) {
					case "xforms-targetid":
						targetid = n;
						break;
					case "xforms-name":
						name = n;
						break;
					case "xforms-delay":
						delay = n;
						break;
					case "xforms-property":
						properties[n.getAttribute("xf-name")] = n.hasAttribute("xf-value") ? new XsltForms_binding(subform, n) : n.textContent;
						break;
				}
			});
			this.name = name ? (name.hasAttribute("xf-value") ? new XsltForms_binding(subform, name) : name.textContent) : elt.getAttribute("xf-name");
			this.target = targetid ? (targetid.hasAttribute("xf-value") ? new XsltForms_binding(subform, targetid) : targetid.textContent) : elt.getAttribute("xf-targetid");
			this.delay = delay ? (delay.hasAttribute("xf-value") ? new XsltForms_binding(subform, delay) : delay.textContent) : elt.getAttribute("xf-delay");
			this.properties = properties;
			break;
		case "xforms-hide":
			this.name = "xforms-dialog-close";
			this.target = elt.getAttribute("xf-dialog");
			break;
		case "xforms-rebuild":
		case "xforms-recalculate":
		case "xforms-refresh":
		case "xforms-reset":
		case "xforms-revalidate":
			this.name = elt.localName.toLowerCase();
			this.target = elt.getAttribute("xf-model");
			break;
		case "xforms-send":
			this.name = "xforms-submit";
			this.target = elt.getAttribute("xf-submission");
			break;
		case "xforms-setfocus":
			var control;
			Array.prototype.slice.call(elt.children).forEach(function(n) {
				switch(n.localName.toLowerCase()) {
					case "xforms-control":
						control = n;
						break;
				}
			});
			this.name = "xforms-focus";
			this.target = control ? (control.hasAttribute("xf-value") ? new XsltForms_binding(subform, control) : control.textContent) : elt.getAttribute("xf-control");
			break;
		case "xforms-show":
			this.name = "xforms-dialog-open";
			this.target = elt.getAttribute("xf-dialog");
			break;
}
	this.subform = subform;
	this.init(elt);
}

XsltForms_dispatch.prototype = new XsltForms_abstractAction();


		
/**
 * * '''run''' method : dispatches an XForms event
 * @callback
 */

XsltForms_dispatch.prototype.run = function(element, ctx, evt) {
	var evname = this.name;
	if (evname.bind_evaluate) {
		evname = XsltForms_globals.stringValue(evname.bind_evaluate(this.subform));
	}
	var target = this.target;
	if (target && target.bind_evaluate) {
		target = XsltForms_globals.stringValue(target.bind_evaluate(this.subform));
	}
	if (!target) {
		switch (evname) {
			case "xforms-submit":
				target = document.getElementById(XsltForms_browser.getDocMeta(ctx.ownerDocument, "model")).xfElement.defaultSubmission;
				break;
			case "xforms-rebuild":
			case "xforms-recalculate":
			case "xforms-refresh":
			case "xforms-reset":
			case "xforms-revalidate":
				target = document.getElementById(XsltForms_browser.getDocMeta(ctx.ownerDocument, "model")).xfElement;
				break;
		}
	} else {
		target = typeof target === "string"? XsltForms_idManager.find(target) : target;
		if (!target && evname.indexOf("xforms-") === 0) {
			evname = "xforms-binding-exception";
			target = element;
		}
	}
	var evtctx = {};
	for (var prop in this.properties) {
		if (prop !== "" && this.properties.hasOwnProperty(prop)) {
			evtctx[prop] = this.properties[prop].bind_evaluate ? this.properties[prop].bind_evaluate(this.subform) : this.properties[prop];
		}
	}
	var delay = 0;
	if (this.delay) {
		if (this.delay.bind_evaluate) {
			delay = XsltForms_globals.numberValue(this.delay.bind_evaluate(this.subform));
		} else {
			delay = XsltForms_globals.numberValue(this.delay);
		}
	}
	if (delay > 0 ) {
		window.setTimeout("XsltForms_xmlevents.dispatch(document.getElementById('"+target.id+"'),'"+evname+"')", delay);
	} else {
		XsltForms_xmlevents.dispatch(target, evname, null, null, null, null, evtctx);
	}
};