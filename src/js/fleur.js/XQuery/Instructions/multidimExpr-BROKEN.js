/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.multidimExpr] = function(ctx, children, callback) {
  var seq = new Fleur.Sequence();
  var i = 0;
  var cb = function(n) {
    if (n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    }
    if (n !== Fleur.EmptySequence) {
      var md = new Fleur.Multidim();
      if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
        md.appendChild(n);
      } else {
        n.childNodes.forEach(function(n2) {
          md.appendChild(n2);
        });
      }
      seq.appendChild(md);
    }
    i++;
    if (i === children.length) {
      Fleur.callback(function() {callback(seq);});
      return;
    }
    Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb);
  };
  if (children.length !== 0) {
    Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
  } else {
    Fleur.callback(function() {callback(seq);});
  }
};