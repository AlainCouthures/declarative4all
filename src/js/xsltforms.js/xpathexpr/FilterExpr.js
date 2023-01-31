"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module FilterExpr
 * @description  === XsltForms_filterExpr Class ===
 * XPath Expression Class for filtering nodes according to a predicate
 * * constructor function : initializes specific properties
 */
    
function XsltForms_filterExpr(expr, predicate) {
  this.expr = expr;
  this.predicate = predicate;
}


    
/**
 * * '''evaluate''' method : evaluates this filtering expression object
 */

XsltForms_filterExpr.prototype.evaluate = function(ctx) {
  var nodes = XsltForms_globals.nodeSetValue(this.expr.evaluate(ctx));
  for (var i = 0, len = this.predicate.length; i < len; ++i) {
    var nodes0 = nodes;
    nodes = [];
    for (var j = 0, len1 = nodes0.length; j < len1; ++j) {
      var n = nodes0[j];
      var newCtx = ctx.clone(n, j, nodes0);
      if (XsltForms_globals.booleanValue(this.predicate[i].evaluate(newCtx))) {
        nodes.push(n);
      }
    }
  }
  return nodes;
};