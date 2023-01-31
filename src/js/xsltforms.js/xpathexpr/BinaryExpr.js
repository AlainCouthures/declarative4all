"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module BinaryExpr
 * @description  === XsltForms_binaryExpr Class ===
 * XPath Expression Class for binary expressions
 * * constructor function : initializes specific properties
 */
    
function XsltForms_binaryExpr(expr1, op, expr2) {
  this.expr1 = expr1;
  this.expr2 = expr2;
  this.op = op.replace("&gt;", ">").replace("&lt;", "<");
}


    
/**
 * * '''evaluate''' method : evaluates this Binary expression object. No precedence treatment required, this beeing already done at XSLT transformation step.
 */

XsltForms_binaryExpr.prototype.evaluate = function(ctx) {
  var v1 = this.expr1.evaluate(ctx);
  var v2 = this.expr2.evaluate(ctx);
  var n1;
  var n2;
  if (v1 && v2 && (((typeof v1) === "object" && v1.length > 1) || ((typeof v2) === "object" && v2.length > 1)) && 
    (this.op === "=" || this.op === "!=" || this.op === "<" || this.op === "<=" || this.op === ">" || this.op === ">=")) {
    if (typeof v1 !== "object") {
      v1 = [v1];
    }
    if (typeof v2 !== "object") {
      v2 = [v2];
    }
    for (var i = 0, len = v1.length; i < len; i++) {
      n1 = XsltForms_globals.numberValue([v1[i]]);
      if (isNaN(n1)) {
        n1 = XsltForms_globals.stringValue([v1[i]]);
      }
      for (var j = 0, len1 = v2.length; j < len1; j++) {
        n2 = XsltForms_globals.numberValue([v2[j]]);
        if (isNaN(n2)) {
          n2 = XsltForms_globals.stringValue([v2[j]]);
        }
        /*eslint eqeqeq:0 */
        switch (this.op) {
          case '=':
            if (n1 == n2) {
              return true;
            }
            break;
          case '!=':
            if (n1 != n2) {
              return true;
            }
            break;
          
          case '<':
            if (n1 < n2) {
              return true;
            }
            break;
          case '<=':
            if (n1 <= n2) {
              return true;
            }
            break;
          case '>':
            if (n1 > n2) {
              return true;
            }
            break;
          case '>=':
            if (n1 >= n2) {
              return true;
            }
            break;
        }
      }
    }
    return false;
  }
  n1 = XsltForms_globals.numberValue(v1);
  n2 = XsltForms_globals.numberValue(v2);
  if (isNaN(n1) || isNaN(n2)) {
    n1 = XsltForms_globals.stringValue(v1);
    n2 = XsltForms_globals.stringValue(v2);
  }
  var res = 0;
  switch (this.op) {
    case 'or'  : res = XsltForms_globals.booleanValue(v1) || XsltForms_globals.booleanValue(v2); break;
    case 'and' : res = XsltForms_globals.booleanValue(v1) && XsltForms_globals.booleanValue(v2); break;
    case '+'   : res = n1 + n2; break;
    case '-'   : res = n1 - n2; break;
    case '*'   : res = n1 * n2; break;
    case 'mod' : res = n1 % n2; break;
    case 'div' : res = n1 / n2; break;
    case '='   : res = n1 === n2; break;
    case '!='  : res = n1 !== n2; break;
    case '<'   : res = n1 < n2; break;
    case '<='  : res = n1 <= n2; break;
    case '>'   : res = n1 > n2; break;
    case '>='  : res = n1 >= n2; break;
  }
  return typeof res === "number" ? Math.round(res*1000000)/1000000 : res;
};