/*eslint-env browser*/
/*globals XsltForms_globals */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module Schema
 * @description  === "XsltForms_schema" class ===
 * Schema  Class
 * * constructor function : creates a Schema object after checking it doesn't exist yet
 */
		
function XsltForms_schema(subform, ns, sname, prefixes) {
	if (XsltForms_schema.all[ns]) {
		XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-link-exception", "More than one schema with the same namespace declaration");
		return;
	}
	if (ns === "") {
		return XsltForms_schema.all["http://www.w3.org/2002/xforms"];
	}
	this.subform = subform;
	this.name = sname;
	this.ns = ns;
	this.types = {};
	this.prefixes = prefixes || {};
	XsltForms_schema.all[ns] = this;
	if (subform) {
		subform.schemas.push(this);
	}
}


		
/**
 * * '''dispose''' method : clears the properties of this object
 * @callback
 */

XsltForms_schema.prototype.dispose = function(subform) {
	XsltForms_schema.all[this.ns] = null;
	this.types = null;
	this.prefixes = null;
};

		
/**
 * * '''all''' associative array : stores all schemas according to their respective namespace
 */

XsltForms_schema.all = {};


		
/**
 * * '''getType''' method : gets a type according to a given name for this schema
 */

XsltForms_schema.prototype.getType = function(tname) {
	if (tname.indexOf(":") !== -1) {
		var res = tname.split(":");
		var prefix = res[0];
		var ns = this.prefixes[prefix];
		if (ns) {
			return XsltForms_schema.getTypeNS(ns, res[1]);
		}
		return XsltForms_schema.getType(tname);
	}
	var type = this.types[tname];
	if (!type) {
		alert("Type " + tname + " not defined");
		throw new Error("Error");
	}
	return type;
};


		
/**
 * * '''getType''' function : gets a type according to a given prefix:name
 */

XsltForms_schema.getType = function(tname) {
	tname = tname || "xsd:string";
	var res = tname.split(":");
	if (typeof(res[1]) === "undefined") {
		return XsltForms_schema.getTypeNS(XsltForms_schema.prefixes.xforms, res[0]);
	} else {
		return XsltForms_schema.getTypeNS(XsltForms_schema.prefixes[res[0]], res[1]);
	}
};


		
/**
 * * '''getTypeNS''' function : gets a type according to a given namespace and a given name
 */

XsltForms_schema.getTypeNS = function(ns, tname) {
	var schema = XsltForms_schema.all[ns];
	if (!schema) {
		alert("Schema for namespace " + ns + " not defined for type " + tname);
		throw new Error("Error");
	}
	var type = schema.types[tname];	
	if (!type) {
		if (XsltForms_globals.debugMode) {
			alert("Type " + tname + " not defined in namespace " + ns);
		}
		type = XsltForms_schema.getTypeNS("http://www.w3.org/2001/XMLSchema", "string");
	}
	return type;
};


		
/**
 * * '''get''' function : gets a schema according to a given namespace
 */

XsltForms_schema.get = function(subform, ns) {
	var schema = XsltForms_schema.all[ns];
	if (!schema) {
		schema = new XsltForms_schema(subform, ns);
	}
	return schema;
};


		
/**
 * * '''prefixes''' associative array : initializes default prefixes and namespaces
 */

XsltForms_schema.prefixes = {
	"xsd_" : "http://www.w3.org/2001/XMLSchema",
	"xsd" : "http://www.w3.org/2001/XMLSchema",
	"xs" : "http://www.w3.org/2001/XMLSchema",
	"xf" : "http://www.w3.org/2002/xforms",
	"xform" : "http://www.w3.org/2002/xforms",
	"xforms" : "http://www.w3.org/2002/xforms",
	"xsltforms" : "http://www.agencexml.com/xsltforms",
	"rte" : "http://www.agencexml.com/xsltforms/rte",
	"dcterms" : "http://purl.org/dc/terms/"
};


		
/**
 * * '''registerPrefix''' function : adds a prefix and the corresponding namespace to the "prefixes" associative array
 */

XsltForms_schema.registerPrefix = function(prefix, namespace) {
	this.prefixes[prefix] = namespace;
};