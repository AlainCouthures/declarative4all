"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module PredicateExpr
 * @description  === PredicateExpr Class ===
 * XPath Expression Class for predicate expressions
 * * constructor function : initializes expr property
 */
    
function XsltForms_predicateExpr(expr) {
  this.expr = expr;
}


    
/**
 * * '''evaluate''' method : evaluates as a boolean value this predicate expression object comparing a number value to current position if possible
 */

XsltForms_predicateExpr.prototype.evaluate = function(ctx) {
  var v = this.expr.evaluate(ctx);
  return typeof v === "number" ? ctx.position === v : XsltForms_globals.booleanValue(v);
};