/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.attributeList] = function(ctx, children, callback, elt) {
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    if (n === Fleur.EmptySequence) {
      Fleur.callback(function() {callback(elt);});
    } else if (n.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
      elt.setAttributeNode(n);
      if (children.length > 1) {
        Fleur.XQueryEngine[Fleur.XQueryX.attributeList](ctx, children.slice(1), function(n) {
          Fleur.callback(function() {callback(n);});
        }, elt);
      } else {
        Fleur.callback(function() {callback(elt);});
      }
    } else {
      Fleur.callback(function() {callback(n);});
    }
  }, elt);
};