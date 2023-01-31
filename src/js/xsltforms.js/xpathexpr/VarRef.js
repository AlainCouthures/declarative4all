"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module VarRef
 * @description  === XsltForms_varRef Class ===
 * XPath Expression Class for variables get
 * * constructor function
 */
    
function XsltForms_varRef(vname) {
  this.name = vname;
}


    
/**
 * * '''evaluate''' method : gets the variable value
 */

XsltForms_varRef.prototype.evaluate = function(ctx) {
/*
  if (!ctx.varresolver || !ctx.varresolver[this.name]) {
    XsltForms_globals.error(this, "xforms-compute-exception", "Variable $" + this.name + " not found");
  }
*/
  let varxf = XsltForms_varResolver(ctx.element, this.name);
  for (var i = 0, l = varxf.depsNodesRefresh.length; i < l ; i++) {
    ctx.addDepNode(varxf.depsNodesRefresh[i]);
  }
  for (i = 0, l = varxf.depsNodesBuild.length; i < l ; i++) {
    ctx.addDepNode(varxf.depsNodesBuild[i]);
  }
  for (var j = 0, l2 = varxf.depsElements.length; j < l2 ; j++) {
    ctx.addDepElement(varxf.depsElements[j]);
  }
  return varxf.boundnodes;
};

function XsltForms_varResolver(elt, name) {
  let p = elt;
  while (p) {
    if (p.previousSibling) {
      p = p.previousSibling;
      if (p.localName === "xforms-var" && p.xfElement.name === name) {
        return p.xfElement;
      }
    } else {
      p = p.parentNode;
    }
  }
  XsltForms_globals.error(null, "xforms-compute-exception", "Variable $" + name + " not found");
}