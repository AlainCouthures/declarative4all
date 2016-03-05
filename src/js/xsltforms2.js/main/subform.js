/*eslint-env browser*/
/*globals XsltForms_engine XsltForms_browser XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module subform
 * @description  === "XsltForms_subform" ===
 * SubForm class for XForms Management
 */

var XsltForms_subform = {
	models : [],
	schemas : [],
	instances : [],
	binds : [],
	xpaths : [],
	subforms : [],
	listeners : [],
	ready : false,
	counters: {
		model: 0,
		instance: 0
	}
};
		
/**
 * * '''construct''' method : reconstructs the models for this object
 */

XsltForms_subform.construct = function() {
	var subf = this;
	this.instances.forEach(function(inst) {
		inst.construct(subf);
	});
	this.binds.forEach(function(b) {
		b.refresh();
	});
	this.instances.forEach(function(inst) {
		inst.revalidate();
	});
	this.models.forEach(function(m) {
		XsltForms_xmlevents.dispatch(m, "xforms-subform-ready");
	});
	this.ready = true;
};

		
/**
 * * '''dispose''' method : clears the properties and recycles the associated nodes
 */

XsltForms_subform.dispose = function() {
	var scriptelt = document.getElementById(this.id + "-script");
	scriptelt.parentNode.removeChild(scriptelt);
	for (var h = 0, len0 = this.subforms.length; h < len0; h++) {
		this.subforms[0].dispose();
	}
	this.subforms = null;
	XsltForms_engine.dispose(document.getElementById(this.eltid));
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

XsltForms_engine.create.subform = function(subform, elt) {
	Object.assign(elt, XsltForms_subform);
	if (subform) {
		subform.subforms.push(elt);
	}
};