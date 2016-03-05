/*eslint-env browser*/
/*globals XsltForms_browser XsltForms_engine XsltForms_xmlevents*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module element
 * @description  === "XsltForms_element" class ===
 * Element  Class
 * * constructor function : empty
 */
		
var XsltForms_element = {
	depsId: 0,
	depsElements: [],
	depsNodesBuild: [],
	depsNodesRefresh: []
};

		
/**
 * * '''init''' method : initializes properties 
 */

XsltForms_element.init = function(subform) {
	this.subform = subform;
	this.depsIdB = XsltForms_element.depsId++;
	this.depsIdR = XsltForms_element.depsId++;
	var p = this.parentNode;
	while (p) {
		if (p.varScope) {
			for (var v in p.varScope) {
				if (!this.varResolver) {
					this.varResolver = {};
				}
				this.varResolver[v] = p.varScope[v];
			}
		}
		p = p.parentNode;
	}
};


		
/**
 * * '''dispose''' method : clears properties of this element
 */

XsltForms_element.dispose = function() {
	this.depsElements = null;
	if (this.depsNodesBuild) {
		for (var i = 0, len = this.depsNodesBuild.length; i < len; i++) {
			XsltForms_browser.rmValueMeta(this.depsNodesBuild[i], "depfor", this.depsIdB);
		}
	}
	this.depsNodesBuild = null;
	if (this.depsNodesRefresh) {
		for (var i2 = 0, len2 = this.depsNodesRefresh.length; i2 < len2; i2++) {
			XsltForms_browser.rmValueMeta(this.depsNodesRefresh[i2], "depfor", this.depsIdR);
		}
	}
	this.depsNodesRefresh = null;
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			this[key] = null;
			delete this[key];
		}
	}   
};


		
/**
 * * '''build''' method : abstractly builds this element from dependencies
 */

XsltForms_element.build = function(ctx, varresolver) {
	if (this.hasBinding) {
		var deps = this.depsElements;
		var depsN = this.depsNodesBuild;
		var depsR = this.depsNodesRefresh;
		var build = !XsltForms_engine.ready || (deps.length === 0) || ctx !== this.ctx;
		var refresh = false;
		var changes = XsltForms_engine.changes;
		if (!build) {
			build = depsN.some(function(d) {
				return d.nodeName === "";
			});
		}
		for (var i = 0, len = deps.length; !build && i < len; i++) {
			var el = deps[i];
			for (var j = 0, len1 = changes.length; !build && j < len1; j++) {
				if (el === changes[j]) {
					if (el.instances) {
						if (el.rebuilded || el.newRebuilded) {
							build = true;
						} else {
							for (var k = 0, len2 = depsN.length; !build && k < len2; k++) {
								build = el.nodesChanged.indexOf(depsN[k]) !== -1;
							}
							if (!build) {
								for (var n = 0, len3 = depsR.length; n < len3; n++) {
									refresh = el.nodesChanged.indexOf(depsR[n]) !== -1;
								}
							}
						}
					} else {
						build = true;
					}
				}
			}
		}
		this.changed = build || refresh;
		if (build) {
			depsN.forEach(function(d) {
				XsltForms_browser.rmValueMeta(d, "depfor", this.depsIdB);
			});
			depsN = [];
			depsR.forEach(function(d) {
				XsltForms_browser.rmValueMeta(d, "depfor", this.depsIdR);
			});
			depsR = [];
			deps = [];
			this.ctx = ctx;
			this.build_(ctx, varresolver);
		}
	} else {
		this.node = ctx;
	}
};

		
/**
 * * '''evaluateBinding''' method : evaluates the spec'ed binding and gathers any errors
 */

XsltForms_element.evaluateBinding = function(binding, ctx, varresolver) {
	this.boundnodes = null;
	var errmsg = null;
	if (binding) {
		if (this.varResolver) {
			for (var v in this.varResolver) {
				if (!varresolver) {
					varresolver = {};
				}
				varresolver[v] = this.varResolver[v];
			}
		}
		this.boundnodes = binding.bind_evaluate(this.subform, ctx, varresolver, this.depsNodesBuild, this.depsIdB, this.depsElements);
		if (this.boundnodes || this.boundnodes === "") {
			return this.boundnodes;
		}
		// A 'null' binding means bind-ID was not found.
		errmsg = "non-existent bind-ID("+ binding.bind + ") on element(" + this.id + ")!";
	} else {
		errmsg = "no binding defined for element("+ this.id + ")!";
	}
	XsltForms_browser.assert(errmsg);
	if (XsltForms_engine.building && XsltForms_engine.debugMode) {
		//
		// Do not fail here, to keep on searching for more errors.
		XsltForms_engine.bindErrMsgs.push(errmsg);
		XsltForms_xmlevents.dispatch(this, "xforms-binding-exception");
		this.nodes = [];
	} else {
		XsltForms_engine.error(this, "xforms-binding-exception", errmsg);
	}
	return this.boundnodes;
};