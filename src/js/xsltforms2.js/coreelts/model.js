/*eslint-env browser*/
/*globals XsltForms_engine XsltForms_xmlevents XsltForms_schema XsltForms_coreElement XsltForms_xpathCoreFunctions Fleur XsltForms_browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module model
 * @description  === "XsltForms_model" ===
 * * constructor function
 */
		
var XsltForms_model = {
	instances: {},
	binds: [],
	nodesChanged: [],
	newNodesChanged: [],
	schemas: [],
	defaultInstance: null,
	defaultSubmission: null
};
		
/**
 * * '''addInstance''' method : adds an instance to this model
 */

XsltForms_model.addInstance = function(instance) {
	this.instances[instance.id] = instance;
	this.defaultInstance = this.defaultInstance || instance;
};

		
/**
 * * '''addBind''' method : adds a binding to this model
 */

XsltForms_model.addBind = function(bind) {
	this.binds.push(bind);
};

		
/**
 * * '''dispose''' method : clears the properties of this object
 */

XsltForms_model.dispose = function(subform) {
	if (subform && this.nbsubforms !== 1) {
		this.subforms[subform] = null;
		this.nbsubforms--;
		return;
	}
	this.instances = null;
	this.binds = null;
	this.itext = null;
	this.defaultInstance = null;
	for (var i = 0, l = XsltForms_engine.models.length; i < l; i++) {
		if (XsltForms_engine.models[i] === this) {
			XsltForms_engine.models.splice(i, 1);
			break;
		}
	}
	XsltForms_coreElement.prototype.dispose.call(this);
};

		
/**
 * * '''getInstance''' method : gets an instance of this model by its id
 */

XsltForms_model.getInstance = function(id) {
	return id ? this.instances[id] : this.defaultInstance;
};

		
/**
 * * '''getInstanceDocument''' method : gets the document of an instance of this model by the instance id
 */

XsltForms_model.getInstanceDocument = function(id) {
	var instance = this.getInstance(id);
	return instance? instance.doc : null;
};

		
/**
 * * '''findInstance''' method : finds the corresponding instance of a node in this model
 */

XsltForms_model.findInstance = function(node) {
	var doc = node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument;
	for (var id in this.instances) {
		if (this.instances.hasOwnProperty(id)) {
			var inst = this.instances[id];
			if (doc === inst.doc) {
				return inst;
			}
			for (var fn in inst.archive) {
				if (inst.archive.hasOwnProperty(fn)) {
					if (doc === inst.archive[fn].doc) {
						return inst;
					}
				}
			}
		}
	}
	return null;
};


		
/**
 * * '''construct''' method : construct step is forwarded to instances and corresponding XForms events are dispatched
 */

XsltForms_model.construct = function() {
	if (!XsltForms_engine.ready) {
		XsltForms_browser.forEach(this.instances, "construct");
	}
	if (XsltForms_engine.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-rebuild");
	} else {
		this.rebuild();
	}
	XsltForms_xmlevents.dispatch(this, "xforms-model-construct-done");
	if (this === XsltForms_engine.models[XsltForms_engine.models.length - 1]) {
		window.setTimeout("XsltForms_engine.models.forEach(function(m) {	XsltForms_xmlevents.dispatch(m, 'xforms-ready');})", 1);
	}
};
		
/**
 * * '''handleEvent''' method : force event handling by firing it
 */

XsltForms_model.handleEvent = function(evtname, evcontext) {
	XsltForms_xmlevents.dispatch(this, evtname, null, null, null, null, evcontext);
};

		
/**
 * * '''reset''' method : reset action is forwarded to instances and this model is tagged as rebuilded
 */

XsltForms_model.reset = function() {
	XsltForms_browser.forEach(this.instances, "reset");
	this.setRebuilded(true);
	XsltForms_engine.addChange(this);
};


		
/**
 * * '''rebuild''' method : refresh action is forwarded to instances and the "xforms-recalculate" event is dispatched
 */

XsltForms_model.rebuild = function() {
	if (XsltForms_engine.ready) {
		this.setRebuilded(true);
	}
	XsltForms_browser.forEach(this.binds, "refresh");
	if (XsltForms_engine.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-recalculate");
	} else {
		this.recalculate();
	}
};


		
/**
 * * '''recalculate''' method : recalculate action is forwarded to instances and the "xforms-revalidate" event is dispatched
 */

XsltForms_model.recalculate = function() { 
	XsltForms_browser.forEach(this.binds, "recalculate");
	if (XsltForms_engine.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-revalidate");
	} else {
		this.revalidate();
	}
};


		
/**
 * * '''revalidate''' method : revalidate action is forwarded to instances and the "xforms-refresh" event is dispatched
 */

XsltForms_model.revalidate = function() {
	XsltForms_browser.forEach(this.instances, "revalidate");
	if (XsltForms_engine.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-refresh");
	}
};


		
/**
 * * '''refresh''' method : no action
 */

XsltForms_model.refresh = function() {
};


		
/**
 * * '''addChange''' method : stacks this model as changed according to current step
 */

XsltForms_model.addChange = function(node) {
	var list = XsltForms_engine.building? this.newNodesChanged : this.nodesChanged;
	if (!XsltForms_browser.inArray(node, list)) {
		XsltForms_engine.addChange(this);
	}
	if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE && !XsltForms_browser.inArray(node, list)) {
		list.push(node);
		node = node.ownerElement ? node.ownerElement : node.selectSingleNode("..");
	}
	while (node && node.nodeType !== Fleur.Node.DOCUMENT_NODE && !XsltForms_browser.inArray(node, list)) {
		list.push(node);
		node = node.nodeType === Fleur.Node.ENTRY_NODE ? node.ownerMap : node.parentNode;
	}
};


		
/**
 * * '''setRebuilded''' method : stores the rebuilded state according to current step
 */

XsltForms_model.setRebuilded = function(value) {
	if (XsltForms_engine.building) {
		this.newRebuilded = value;
	} else {
		this.rebuilded = value;
	}
};

		
/**
 * * '''itext''' method : stores the iText attached to this model
 */

XsltForms_model.additext = function(itext) {
	this.itext = itext;
	return this;
};


XsltForms_engine.create.model = function(subform, elt) {
	/*
	if (elt) {
		elt.xfElement.subforms[subform] = true;
		elt.xfElement.nbsubforms++;
		subform.models.push(elt.xfElement);
		XsltForms_engine.addChange(elt.xfElement);
		return elt.xfElement;
	}
	*/
	if (subform.id !== "xsltforms-mainform") {
		XsltForms_engine.addChange(elt);
	}
	XsltForms_engine.models.push(elt);
	subform.counters.model++;
	subform.models.push(elt);
	XsltForms_engine.defaultModel = XsltForms_engine.defaultModel || elt;
	Object.assign(elt, XsltForms_model);
	if (elt.getAttribute("schemas")) {
		var knownschemas = Object.getOwnPropertyNames(XsltForms_schema.all);
		elt.getAttribute("schemas").split(" ").forEach(
			function(schema) {
				if (knownschemas.indexOf(schema) === -1) {
					XsltForms_engine.error(this, "xforms-link-exception", "Schema " + schema + " not found");
				}
			}
		);
	}
	if (elt.getAttribute("functions")) {
		var knownfunctions = Object.getOwnPropertyNames(XsltForms_xpathCoreFunctions).map(
			function(fullname) {
				return fullname.split(" ")[1];
			}
		);
		elt.getAttribute("functions").split(" ").forEach(
			function(shortname) {
				if (knownfunctions.indexOf(shortname) === -1) {
					XsltForms_engine.error(this, "xforms-compute-exception", "Function " + shortname + "() not found");
				}
			}
		);
	}
	if (elt.getAttribute("version")) {
		elt.getAttribute("version").split(" ").forEach(
			function(v) {
				if (v !== "1.0" && v !== "1.1") {
					XsltForms_engine.error(XsltForms_engine.defaultModel, "xforms-version-exception", "Version " + v + " not supported");
				}
			}
		);
	}
};

