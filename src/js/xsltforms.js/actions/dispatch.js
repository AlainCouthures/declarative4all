/*eslint-env browser*/
/*globals XsltForms_abstractAction XsltForms_globals XsltForms_browser XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module dispatch
 * @description  === "XsltForms_dispatch" class ===
 * Dispatch Action Class
 * * constructor function : stores specific properties
 */
		
function XsltForms_dispatch(subform, evname, target, properties, ifexpr, whileexpr, iterateexpr, delay) {
	this.subform = subform;
	this.name = evname;
	this.target = target;
	this.properties = properties;
	this.init(ifexpr, whileexpr, iterateexpr);
	this.delay = delay;
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
		target = typeof target === "string"? document.getElementById(target) : target;
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