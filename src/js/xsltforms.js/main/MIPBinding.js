"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module MIPBinding
 * @description  === "Binding" class ===
 * XForms Binding Management
 * * constructor function : "xpath", "model" and "bind" properties are resolved
 */

function XsltForms_mipbinding(subform, elt, mip, miptype, model) {
  this.binding = new XsltForms_binding(subform, elt, mip, miptype, model);
  this.nodes = [];
  this.depsElements = [];
  this.depsNodes = [];
}


    
/**
 * * '''evaluate''' method : evaluates the binding
 */

XsltForms_mipbinding.prototype.evaluate = function(ctx, node) {
  var deps = null;
  var depsN = null;
  var curn = this.nodes.length;
  for (var i0 = 0, len0 = this.nodes.length; i0 < len0; i0++ ) {
    if (node === this.nodes[i0].node) {
      deps = this.nodes[i0].deps;
      depsN = this.nodes[i0].depsN;
      curn = i0;
      break;
    }
  }
  if (!deps && !depsN) {
    this.nodes.push({node: node, deps: [], depsN: []});
    deps = depsN = [];
  }
  var build = !XsltForms_globals.ready || (deps.length === 0);
  var changes = XsltForms_globals.changes;
  for (var i1 = 0, len1 = depsN.length; !build && i1 < len1; i1++) {
    build = depsN[i1].nodeName === "";
  }
  for (var i = 0, len = deps.length; !build && i < len; i++) {
    var el = deps[i];
    for (var j = 0, len2 = changes.length; !build && j < len2; j++) {
      if (el === changes[j]) {
        if (el.instances) { //model
          if (el.rebuilded || el.newRebuilded) {
            build = true;
          } else {
            for (var k = 0, len3 = depsN.length; !build && k < len3; k++) {
              build = XsltForms_browser.inArray(depsN[k], el.nodesChanged);
            }
          }
        } else {
          build = true;
        }
      }
    }
  }
  if (build) {
    // alert("Evaluate \"" + this.binding.xpath.expression + "\"");
    depsN.length = 0;
    deps.length = 0;
    this.nodes[curn].result = this.binding.bind_evaluate(ctx.subform, ctx.node, null, this.nodes[curn].depsN, null, this.nodes[curn].deps);
    return this.nodes[curn].result;
  }
  return this.nodes[curn].result;
};

    
/**
 * * '''nodedispose''' method : disposes of a node meta data
 */

XsltForms_mipbinding.prototype.nodedispose_ = function(node) {
  for (var i = 0, len = this.nodes.length; i < len; i++ ) {
    if (node === this.nodes[i].node) {
      this.nodes[i] = this.nodes[len-1];
      this.nodes.pop();
      break;
    }
  }
};

XsltForms_mipbinding.nodedispose = function(node) {
  var bindids = XsltForms_browser.getMeta(node, "bind");
  if (bindids) {
    var binds = bindids.split(" ");
    for (var j = 0, len2 = binds.length; j < len2; j++) {
      var bind = XsltForms_collection[binds[j]].xfElement;
      if (bind.required) {
        bind.required.nodedispose_(node);
      }
      if (bind.relevant) {
        bind.relevant.nodedispose_(node);
      }
      if (bind.readonly) {
        bind.readonly.nodedispose_(node);
      }
      if (bind.constraint) {
        bind.constraint.nodedispose_(node);
      }
      if (bind.calculate) {
        bind.calculate.nodedispose_(node);
      }
    }
  }
  for (var n = node.firstChild; n; n = n.nextSibling) {
    if (n.nodeType === Fleur.Node.ELEMENT_NODE) {
      XsltForms_mipbinding.nodedispose(n);
    }
  }
};