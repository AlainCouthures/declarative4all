"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module XPathFunction
 * @description  === XsltForms_xpathFunction Class ===
 * XPath Function Class
 * * constructor function : initializes properties
 * ** '''acceptContext''' : whether the current context is required as first argument for this XPath Function object
 * ** '''defaultTo''' : default argument
 * *** '''DEFAULT_NONE''' : no default argument
 * *** '''DEFAULT_NODE''' : current node
 * *** '''DEFAULT_NODESET''' : array containing the current node
 * *** '''DEFAULT_STRING''' : text value of the current node
 * ** '''returnNodes''' : unused
 * ** '''body''' : corresponding Javascript function
 */
    
function XsltForms_xpathFunction(acceptContext, defaultTo, returnNodes, body) {
  this.evaluate = body;
  this.defaultTo = defaultTo;
  this.acceptContext = acceptContext;
  this.returnNodes = returnNodes;
}

XsltForms_xpathFunction.DEFAULT_NONE = null;
XsltForms_xpathFunction.DEFAULT_NODE = 0;
XsltForms_xpathFunction.DEFAULT_NODESET = 1;
XsltForms_xpathFunction.DEFAULT_STRING = 2;


    
/**
 * * '''call''' method : calls the corresponding Javascript function after managing default argument and context presence
 */

XsltForms_xpathFunction.prototype.call = function(context, arguments_) {
  if (arguments_.length === 0) {
    switch (this.defaultTo) {
    case XsltForms_xpathFunction.DEFAULT_NODE:
      if (context.node) {
        arguments_ = [context.node];
      }
      break;
    case XsltForms_xpathFunction.DEFAULT_NODESET:
      if (context.node) {
        arguments_ = [[context.node]];
      }
      break;
    case XsltForms_xpathFunction.DEFAULT_STRING:
      arguments_ = [XsltForms_xpathCoreFunctions.string.evaluate([context.node])];
      break;
    }
  }
  if (this.acceptContext) {
    arguments_.unshift(context);
  }
  return this.evaluate.apply(null, arguments_);
};