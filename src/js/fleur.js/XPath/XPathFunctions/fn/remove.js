"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_remove_2 = function() {
  this.notyet();
};

Fleur.XPathFunctions_fn["remove#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:remove", Fleur.Context.prototype.fn_remove_2,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_integer_1], Fleur.SequenceType_item_0n);
/*
Fleur.XPathFunctions_fn["remove"] = function(ctx, children, callback) {
  if (children.length !== 2) {
    Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
    return;
  }
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    }
    var seq = n;
    Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
      var i, l, index, result;
      var a = Fleur.Atomize(n);
      if (a.schemaTypeInfo === Fleur.Type_error) {
        Fleur.callback(function() {callback(a);});
        return;
      }
      if (a.schemaTypeInfo !== Fleur.Type_integer) {
        Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
        return;
      }
      index = parseInt(a.data, 10) - 1;
      if (seq.nodeType === Fleur.Node.SEQUENCE_NODE) {
        l = seq.childNodes.length;
        if (index >= 0 && index < l) {
          result = new Fleur.Sequence();
          result.nodeType = Fleur.Node.SEQUENCE_NODE;
          i = 0;
          while (i < index) {
            result.appendChild(seq.childNodes[i]);
            i++;
          }
          i++;
          while (i < l) {
            result.appendChild(seq.childNodes[i]);
            i++;
          }
          if (result.childNodes.length === 1) {
            result = result.childNodes[0];
          }
        } else {
          result = seq;
        }
      } else if (index === 0) {
        result = Fleur.EmptySequence;
      } else {
        result = seq;
      }
      Fleur.callback(function() {callback(result);});
    });
  });
};*/