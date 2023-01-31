"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module NodeTestName
 * @description  === XSltForms_nodeTestName Class ===
 * XPath Expression Class for node test expressions
 * * constructor function : initializes prefix and name properties
 */

function XsltForms_nodeTestName(prefix, tname) {
  this.prefix = prefix;
  this.name = tname;
  this.uppercase = tname.toUpperCase();
  this.wildcard = tname === "*";
  this.notwildcard = tname !== "*";
  this.notwildcardprefix = prefix !== "*";
  this.hasprefix = prefix && this.notwildcardprefix;
}


    
/**
 * * '''evaluate''' method : evaluates as a boolean value if a given node has the same namespace and name as this expression object. Wildcard is supported as a valid namespace test as an extension.
 */

XsltForms_nodeTestName.prototype.evaluate = function(node, nsresolver, csensitive) {
  var nodename = node.localName || node.baseName;
  //console.log("nodeTestName: " + node.nodeType + " " + nodename + " =? " + this.name);
  if (this.notwildcard && (nodename !== this.name || (csensitive && nodename.toUpperCase() !== this.uppercase))) {
    return false;
  }
  if (this.wildcard) {
    return this.hasprefix ? node.namespaceURI === nsresolver.lookupNamespaceURI(this.prefix) : true;
  }
  var ns = node.namespaceURI;
  return this.hasprefix ? ns === nsresolver.lookupNamespaceURI(this.prefix) :
    (this.notwildcardprefix ? !ns || ns === "" || ns === nsresolver.lookupNamespaceURI("") : true);
};