"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module NodeTestPI
 * @description  === XsltForms_nodeTestPI Class ===
 * XPath Expression Class for processing instruction test expressions
 * * constructor function : initializes target property
 */
    
function XsltForms_nodeTestPI(target) {
  this.target = target;
}


    
/**
 * * '''evaluate''' method : evaluates as a boolean value if a given node is a processing instruction with the same name as this expression object
 */

XsltForms_nodeTestPI.prototype.evaluate = function(node) {
  return node.nodeType === Fleur.Node.PROCESSING_INSTRUCTION_NODE &&
    (!this.target || node.nodeName === this.target);
};