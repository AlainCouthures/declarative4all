"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module element
 * @description  === "XsltForms_element" class ===
 * Element  Class
 * * constructor function : empty
 */

function XsltForms_element() {
}
    
/**
 * * '''init''' method : initializes properties 
 */

var XsltForms_element_depsId = 0;

XsltForms_element.prototype.init = function(subform, elt) {
  this.subform = subform;
  this.element = elt;
  if (this.element.xfElement) {
    if (!(this.element.xfElement instanceof Array)) {
      this.element.xfElement = [this.element.xfElement];
    }
    this.element.xfElement.push(this);
  } else {
    this.element.xfElement = this;
  }
  this.depsElements = [];
  this.depsNodesBuild = [];
  this.depsNodesRefresh = [];
  this.depsIdB = XsltForms_element_depsId++;
  this.depsIdR = XsltForms_element_depsId++;
  const htmlAttrs = {};
  Array.prototype.slice.call(elt.attributes).forEach(attr => {
    if (attr.name.startsWith("html-")) {
      htmlAttrs[attr.name.substring(5)] = attr.value;
    }
  });
  this.htmlAttrs = htmlAttrs;
};


    
/**
 * * '''dispose''' method : clears properties of this element
 */

XsltForms_element.prototype.dispose = function() {
  if(this.element) {
    this.element.xfElement = null;
    this.element.hasXFElement = null;
    this.element = null;
  }
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

XsltForms_element.prototype.build = function(ctx) {
  if (this.hasBinding) {
    var deps = this.depsElements;
    var depsN = this.depsNodesBuild;
    var depsR = this.depsNodesRefresh;
    var build = !XsltForms_globals.ready || (deps.length === 0) || ctx !== this.ctx;
    //console.log(this.element.localName + " [" + deps.reduce((s, d) => s + (s === "" ? "" : ", ") + d.element.nodeName, "") + "] [" + depsN.reduce((s, d) => s + (s === "" ? "" : ", ") + d.nodeName, "") + "] [" + depsR.reduce((s, d) => s + (s === "" ? "" : ", ") + (d ? d.nodeName : "undefined"), "") + "] " + build);
    var refresh = false;
    var changes = XsltForms_globals.changes;
    for (var i0 = 0, len0 = depsN.length; !build && i0 < len0; i0++) {
      build = depsN[i0].nodeName === "";
    }
    for (var i = 0, len = deps.length; !build && i < len; i++) {
      var el = deps[i];
      for (var j = 0, len1 = changes.length; !build && j < len1; j++) {
        if (el === changes[j]) {
          if (el.instances) { //model
            if (el.rebuilded || el.newRebuilded) {
              build = true;
            } else {
              for (var k = 0, len2 = depsN.length; !build && k < len2; k++) {
                build = XsltForms_browser.inArray(depsN[k], el.nodesChanged);
              }
              if (!build) {
                for (var n = 0, len3 = depsR.length; n < len3; n++) {
                  refresh = XsltForms_browser.inArray(depsR[n], el.nodesChanged);
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
      for (var i4 = 0, len4 = depsN.length; i4 < len4; i4++) {
        XsltForms_browser.rmValueMeta(depsN[i4], "depfor", this.depsIdB);
      }
      depsN.length = 0;
      for (var i5 = 0, len5 = depsR.length; i5 < len5; i5++) {
        XsltForms_browser.rmValueMeta(depsR[i5], "depfor", this.depsIdR);
      }
      depsR.length = 0;
      deps.length = 0;
      this.ctx = ctx;
      this.build_(ctx);
    }
  } else {
    this.element.node = this.controlName === "item" ? this.element.node || ctx : ctx;
  }
};

    
/**
 * * '''evaluateBinding''' method : evaluates the spec'ed binding and gathers any errors
 */

XsltForms_element.prototype.evaluateBinding = function(binding, ctx) {
  this.boundnodes = null;
  var errmsg = null;
  if (binding) {
    this.boundnodes = binding.bind_evaluate(this.subform, ctx, this.element, this.depsNodesBuild, this.depsIdB, this.depsElements);
    if (!Fleur.minimal && this.boundnodes.nodeType) {
      this.boundnodes = this.boundnodes.toArray();
    }
    if (this.boundnodes instanceof Array && this.boundnodes.length !== 0) {
      this.element.setAttribute("xf-bound", "");
    } else {
      this.element.removeAttribute("xf-bound");
    }
    if (this.boundnodes || this.boundnodes === "" || this.boundnodes === 0 || this.boundnodes === false) {
      return this.boundnodes;
    }
    // A 'null' binding means bind-ID was not found.
    errmsg = "non-existent bind-ID("+ binding.bind + ") on element(" + this.element.localName + ")!";
  } else {
    errmsg = "no binding defined for element("+ this.element.localName + ")!";
  }
  XsltForms_browser.assert(errmsg);
  if (XsltForms_globals.building && XsltForms_globals.debugMode) {
    //
    // Do not fail here, to keep on searching for more errors.
    XsltForms_globals.bindErrMsgs.push(errmsg);
    XsltForms_xmlevents.dispatch(this.element, "xforms-binding-exception");
    this.nodes = [];
  } else {
    XsltForms_globals.error(this.element, "xforms-binding-exception", errmsg);
  }
  return this.boundnodes;
};