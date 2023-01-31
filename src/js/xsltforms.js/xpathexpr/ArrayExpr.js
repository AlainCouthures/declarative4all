"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module ArrayExpr
 * @description  === ArrayExpr Class ===
 * XPath Expression Class for array expressions
 * * constructor function : initializes exprs property
 */
    
function ArrayExpr(exprs) {
  this.exprs = exprs;
}


    
/**
 * * '''evaluate''' method : evaluates as a node set this expression object
 */

ArrayExpr.prototype.evaluate = function(ctx) {
  var nodes = [];
  for (var i = 0, len = this.exprs.length; i < len; i++) {
    nodes[i] = this.exprs[i].evaluate(ctx);
  }
  return nodes;
};