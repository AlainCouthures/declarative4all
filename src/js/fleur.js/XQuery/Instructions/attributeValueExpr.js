/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.attributeValueExpr] = function(ctx, children, callback, attr) {
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    var a = Fleur.Atomize(n);
    if (a !== Fleur.EmptySequence && a.nodeType !== Fleur.Node.TEXT_NODE) {
      Fleur.callback(function() {callback(a);});
    } else {
      if (a !== Fleur.EmptySequence) {
        attr.firstChild.data += a.data;
      }
      if (children.length > 1) {
        Fleur.XQueryEngine[Fleur.XQueryX.attributeValueExpr](ctx, children.slice(1), function(n) {
          Fleur.callback(function() {callback(n);});
        }, attr);
      } else {
        Fleur.callback(function() {callback(attr);});
      }
    }
  });
};