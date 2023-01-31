"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_insert$_before_3 = function() {
  this.notyet();
};

Fleur.XPathFunctions_fn["insert-before#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:insert-before", Fleur.Context.prototype.fn_insert$_before_3,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_integer_1, Fleur.SequenceType_item_0n], Fleur.SequenceType_item_0n);
/*
Fleur.XPathFunctions_fn["insert-before"] = function(ctx, children, callback) {
  if (children.length !== 3) {
    Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
    return;
  }
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    if (n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    }
    var seq = n;
    Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
      var index;
      var a1 = Fleur.Atomize(n);
      if (a1.schemaTypeInfo === Fleur.Type_error) {
        Fleur.callback(function() {callback(a1);});
        return;
      }
      if (a1.schemaTypeInfo !== Fleur.Type_integer) {
        Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
        return;
      }
      index = Math.max(parseInt(a1.data, 10) - 1, 0);
      Fleur.XQueryEngine[children[2][0]](ctx, children[2][1], function(n) {
        var a2 = Fleur.Atomize(n);
        if (a2 === Fleur.EmptySequence) {
          Fleur.callback(function() {callback(seq);});
          return;
        }
        if (seq === Fleur.EmptySequence) {
          Fleur.callback(function() {callback(a2);});
          return;
        }
        var result = new Fleur.Sequence();
        if (seq.nodeType === Fleur.Node.SEQUENCE_NODE) {
          var i = 0, l;
          l = seq.childNodes.length;
          index = Math.min(index, l);
          while (i < index) {
            result.appendChild(seq.childNodes[i]);
            i++;
          }
          if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
            a2.childNodes.forEach(function(m) {result.appendChild(m);});
          } else {
            result.appendChild(a2);
          }
          while (i < l) {
            result.appendChild(seq.childNodes[i]);
            i++;
          }
        } else {
          result = new Fleur.Sequence();
          if (index !== 0) {
            result.appendChild(seq);
          }
          if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
            a2.childNodes.forEach(function(m) {result.appendChild(m);});
          } else {
            result.appendChild(a2);
          }
          if (index === 0) {
            result.appendChild(seq);
          }
        }
        Fleur.callback(function() {callback(result);});
      });
    });
  });
};
*/