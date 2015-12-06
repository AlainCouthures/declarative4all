/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_browser XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module subform
 * @description  === "XsltForms_subform" class ===
 * SubForm class for XForms Management
 */
		
function XsltForms_subform(subform, id, eltid) {
	this.subform = subform;
	this.id = id;
	this.eltid = eltid;
	if (eltid) {
		document.getElementById(eltid).xfSubform = this;
	} else {
		var b = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
		b.xfSubform = this;
	}
	this.models = [];
	this.schemas = [];
	this.instances = [];
	this.binds = [];
	this.xpaths = [];
	this.subforms = [];
	this.listeners = [];
	this.ready = false;
	if (subform) {
		subform.subforms.push(this);
	}
	XsltForms_subform.subforms[id] = this;
}

XsltForms_subform.subforms = {};

		
/**
 * * '''construct''' method : reconstructs the models for this object
 */

XsltForms_subform.prototype.construct = function() {
	for (var i = 0, len = this.instances.length; i < len; i++) {
		this.instances[i].construct(this);
	}
	XsltForms_browser.forEach(this.binds, "refresh");
	for (i = 0, len = this.instances.length; i < len; i++) {
		this.instances[i].revalidate();
	}
	XsltForms_xmlevents.dispatchList(this.models, "xforms-subform-ready");
	this.ready = true;
};

		
/**
 * * '''dispose''' method : clears the properties and recycles the associated nodes
 */

XsltForms_subform.prototype.dispose = function() {
	var scriptelt = document.getElementById(this.id + "-script");
	scriptelt.parentNode.removeChild(scriptelt);
	for (var h = 0, len0 = this.subforms.length; h < len0; h++) {
		this.subforms[0].dispose();
	}
	this.subforms = null;
	XsltForms_globals.dispose(document.getElementById(this.eltid));
	for (var i0 = 0, len00 = this.schemas.length; i0 < len00; i0++) {
		this.schemas[i0].dispose(this);
		this.schemas[i0] = null;
	}
	this.schemas = null;
	for (var j = 0, len2 = this.instances.length; j < len2; j++) {
		this.instances[j].dispose(this);
		this.instances[j] = null;
	}
	this.instances = null;
	for (var i = 0, len = this.models.length; i < len; i++) {
		this.models[i].dispose(this);
		this.models[i] = null;
	}
	this.models = null;
	for (var k = 0, len3 = this.xpaths.length; k < len3; k++) {
		this.xpaths[k].dispose(this);
		this.xpaths[k] = null;
	}
	this.xpaths = null;
	this.binds = null;
	XsltForms_subform.subforms[this.id] = null;
	var parentform = this.subform;
	if (parentform) {
		var parentsubforms = parentform.subforms;
		for (var l = 0, len4 = parentsubforms.length; l < len4; l++) {
			if (parentsubforms[l] === this) {
				if (l < len4 - 1) {
					parentsubforms[l] = parentsubforms[len4 - 1];
				}
				parentsubforms.pop();
				break;
			}
		}
	}
	for (var m = 0, len5 = this.listeners.length; m < len5; m++) {
		this.listeners[m].detach();
		this.listeners[m] = null;
	}
	this.listeners = null;
};