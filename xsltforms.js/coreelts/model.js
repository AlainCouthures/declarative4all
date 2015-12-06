/*eslint-env browser*/
/*globals XsltForms_globals XsltForms_xmlevents XsltForms_schema XsltForms_coreElement XsltForms_xpathCoreFunctions Fleur XsltForms_browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module model
 * @description  === "XsltForms_model" class ===
 * * constructor function : specifically gets the associated schemas
 */
		
function XsltForms_model(subform, id, schemas, functions, version) {
	var found;
	if (subform.id !== "xsltforms-mainform") {
		XsltForms_globals.addChange(this);
	}
	this.init(subform, id, null, "xforms-model");
	this.instances = {};
	this.binds = [];
	this.nodesChanged = [];
	this.newNodesChanged = [];
	this.schemas = [];
	this.defaultInstance = null;
	this.defaultSubmission = null;
	XsltForms_globals.models.push(this);
	subform.models.push(this);
	var elt = document.getElementById(id);
	XsltForms_globals.defaultModel = XsltForms_globals.defaultModel || this;
	if (elt) {
		elt.getInstanceDocument = function(modid) {
			return this.xfElement.getInstanceDocument(modid);
		};
		elt.rebuild = function() {
			return this.xfElement.rebuild();
		};
		elt.recalculate = function() {
			return this.xfElement.recalculate();
		};
		elt.revalidate = function() {
			return this.xfElement.revalidate();
		};
		elt.refresh = function() {
			return this.xfElement.refresh();
		};
		elt.reset = function() {
			return this.xfElement.reset();
		};
		elt.handleEvent = function(evtname, evcontext) {
			XsltForms_xmlevents.dispatch(elt, evtname, null, null, null, null, evcontext);
		};
	}
	if (schemas) {
		schemas = schemas.split(" ");
		for (var i = 0, len = schemas.length; i < len; i++) {
			found = false;
			for (var sid in XsltForms_schema.all) {
				if (XsltForms_schema.all.hasOwnProperty(sid)) {
					var schema = XsltForms_schema.all[sid];
					if (schema.name === schemas[i]) {
						this.schemas.push(schema);
						found = true;
						break;
					}
				}
			}
			if (!found) {
				XsltForms_globals.error(this, "xforms-link-exception", "Schema " + schemas[i] + " not found");
			}
		}
	}
	if (functions) {
		var fs = functions.split(" ");
		for (var j = 0, len2 = fs.length; j < len2; j++) {
			found = false;
			for (var k = 0, len3 = XsltForms_xpathCoreFunctions.length; k < len3; k++) {
				if (XsltForms_xpathCoreFunctions[k].split(" ")[1] === fs[j]) {
					found = true;
					break;
				}
			}
			if (!found) {
				try {
					i = eval(fs[j]);
				} catch (e) {
					XsltForms_globals.error(this, "xforms-compute-exception", "Function " + fs[j] + "() not found");
				}
			}
		}
	}
	if (version) {
		var vs = version.split(" ");
		for (var l = 0, len4 = vs.length; l < len4; l++) {
			if (vs[l] !== "1.0" && vs[l] !== "1.1") {
				XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-version-exception", "Version " + vs[l] + " not supported");
				break;
			}
		}
	}
}

XsltForms_model.prototype = new XsltForms_coreElement();


		
/**
 * * '''create''' method : adds an instance to this model
 */

XsltForms_model.create = function(subform, id, schemas, functions, version) {
	var elt = document.getElementById(id);
	if (elt) {
		elt.xfElement.subforms[subform] = true;
		elt.xfElement.nbsubforms++;
		subform.models.push(elt.xfElement);
		XsltForms_globals.addChange(elt.xfElement);
		return elt.xfElement;
	} else {
		return new XsltForms_model(subform, id, schemas, functions, version);
	}
};


		
/**
 * * '''addInstance''' method : adds an instance to this model
 */

XsltForms_model.prototype.addInstance = function(instance) {
	this.instances[instance.element.id] = instance;
	this.defaultInstance = this.defaultInstance || instance;
};

		
/**
 * * '''addBind''' method : adds a binding to this model
 */

XsltForms_model.prototype.addBind = function(bind) {
	this.binds.push(bind);
};

		
/**
 * * '''dispose''' method : clears the properties of this object
 */

XsltForms_model.prototype.dispose = function(subform) {
	if (subform && this.nbsubforms !== 1) {
		this.subforms[subform] = null;
		this.nbsubforms--;
		return;
	}
	this.instances = null;
	this.binds = null;
	this.itext = null;
	this.defaultInstance = null;
	for (var i = 0, l = XsltForms_globals.models.length; i < l; i++) {
		if (XsltForms_globals.models[i] === this) {
			XsltForms_globals.models.splice(i, 1);
			break;
		}
	}
	XsltForms_coreElement.prototype.dispose.call(this);
};

		
/**
 * * '''getInstance''' method : gets an instance of this model by its id
 */

XsltForms_model.prototype.getInstance = function(id) {
	return id ? this.instances[id] : this.defaultInstance;
};

		
/**
 * * '''getInstanceDocument''' method : gets the document of an instance of this model by the instance id
 */

XsltForms_model.prototype.getInstanceDocument = function(id) {
	var instance = this.getInstance(id);
	return instance? instance.doc : null;
};

		
/**
 * * '''findInstance''' method : finds the corresponding instance of a node in this model
 */

XsltForms_model.prototype.findInstance = function(node) {
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

XsltForms_model.prototype.construct = function() {
	if (!XsltForms_globals.ready) {
		XsltForms_browser.forEach(this.instances, "construct");
	}
	if (XsltForms_globals.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-rebuild");
	} else {
		this.rebuild();
	}
	XsltForms_xmlevents.dispatch(this, "xforms-model-construct-done");
	if (this === XsltForms_globals.models[XsltForms_globals.models.length - 1]) {
		window.setTimeout("XsltForms_xmlevents.dispatchList(XsltForms_globals.models, \"xforms-ready\")", 1);
	}
};


		
/**
 * * '''reset''' method : reset action is forwarded to instances and this model is tagged as rebuilded
 */

XsltForms_model.prototype.reset = function() {
	XsltForms_browser.forEach(this.instances, "reset");
	this.setRebuilded(true);
	XsltForms_globals.addChange(this);
};


		
/**
 * * '''rebuild''' method : refresh action is forwarded to instances and the "xforms-recalculate" event is dispatched
 */

XsltForms_model.prototype.rebuild = function() {
	if (XsltForms_globals.ready) {
		this.setRebuilded(true);
	}
	XsltForms_browser.forEach(this.binds, "refresh");
	if (XsltForms_globals.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-recalculate");
	} else {
		this.recalculate();
	}
};


		
/**
 * * '''recalculate''' method : recalculate action is forwarded to instances and the "xforms-revalidate" event is dispatched
 */

XsltForms_model.prototype.recalculate = function() { 
	XsltForms_browser.forEach(this.binds, "recalculate");
	if (XsltForms_globals.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-revalidate");
	} else {
		this.revalidate();
	}
};


		
/**
 * * '''revalidate''' method : revalidate action is forwarded to instances and the "xforms-refresh" event is dispatched
 */

XsltForms_model.prototype.revalidate = function() {
	XsltForms_browser.forEach(this.instances, "revalidate");
	if (XsltForms_globals.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-refresh");
	}
};


		
/**
 * * '''refresh''' method : no action
 */

XsltForms_model.prototype.refresh = function() {
	// Nada?
};


		
/**
 * * '''addChange''' method : stacks this model as changed according to current step
 */

XsltForms_model.prototype.addChange = function(node) {
	var list = XsltForms_globals.building? this.newNodesChanged : this.nodesChanged;
	if (!XsltForms_browser.inArray(node, list)) {
		XsltForms_globals.addChange(this);
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

XsltForms_model.prototype.setRebuilded = function(value) {
	if (XsltForms_globals.building) {
		this.newRebuilded = value;
	} else {
		this.rebuilded = value;
	}
};

		
/**
 * * '''itext''' method : stores the iText attached to this model
 */

XsltForms_model.prototype.additext = function(itext) {
	this.itext = itext;
	return this;
};