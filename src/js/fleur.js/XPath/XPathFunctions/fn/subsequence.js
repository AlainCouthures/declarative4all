"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_subsequence_2 = function() {
  return this.xqx_constantExpr(Fleur.Type_float, 'INF').fn_subsequence_3();
};
Fleur.Context.prototype.fn_subsequence_3 = function() {
  const length = this.item;
  const startingLoc = this.itemstack.pop();
  const sourceSeq = this.itemstack.pop();
  if (startingLoc.data === "-INF" && length.data === "INF" ) {
    this.item = new Fleur.Sequence();
  } else {
    const lengthval = Math.round(Number(Fleur.toJSNumber(length)[1]));
    const startingLocval = Math.round(Number(Fleur.toJSNumber(startingLoc)[1]));
    if (lengthval <= 0) {
      this.item = new Fleur.Sequence();
    }
    if (lengthval === 1 || (sourceSeq.nodeType === Fleur.Node.SEQUENCE_NODE && startingLocval === sourceSeq.childNodes.length && lengthval > 1)) {
      if (sourceSeq.nodeType !== Fleur.Node.SEQUENCE_NODE) {
        this.item = startingLocval === 1 ? sourceSeq : new Fleur.Sequence();
      } else {
        if (startingLoc <= sourceSeq.childNodes.length) {
          this.item = sourceSeq.childNodes[startingLocval - 1];
        } else {
          this.item = new Fleur.Sequence();
        }
      }
    } else {
      if (sourceSeq.nodeType !== Fleur.Node.SEQUENCE_NODE) {
        this.item = startingLocval === 1 ? sourceSeq : Fleur.EmptySequence;
      } else {
        var seq = new Fleur.Sequence();
        for (let i = startingLocval - 1, l = Math.min(i + lengthval, sourceSeq.childNodes.length); i < l; i++) {
          seq.appendChild(sourceSeq.childNodes[i]);
        }
        this.item = seq;
      }
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["subsequence#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:subsequence", Fleur.Context.prototype.fn_subsequence_2,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_numeric_1], Fleur.SequenceType_item_0n);

Fleur.XPathFunctions_fn["subsequence#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:subsequence", Fleur.Context.prototype.fn_subsequence_3,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_numeric_1, Fleur.SequenceType_numeric_1], Fleur.SequenceType_item_0n);
/*
  function(sourceSeq, startingLoc) {
    return Fleur.XPathFunctions_fn["subsequence#3"].jsfunc(sourceSeq, startingLoc, Number.POSITIVE_INFINITY);
  },
  null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Node});
*/
/*
  function(sourceSeq, startingLoc, length) {
    if (startingLoc === Number.NEGATIVE_INFINITY && length === Number.POSITIVE_INFINITY) {
      return Fleur.EmptySequence;
    }
    if (typeof length === "number") {
      length = Math.round(length);
    }
    if (typeof startingLoc === "number") {
      startingLoc = Math.round(startingLoc);
    }
    if (length <= 0) {
      return Fleur.EmptySequence;
    }
    if (Number(length) === 1 || (sourceSeq.nodeType === Fleur.Node.SEQUENCE_NODE && Number(startingLoc) === sourceSeq.childNodes.length && length > 1)) {
      if (sourceSeq.nodeType !== Fleur.Node.SEQUENCE_NODE) {
        return Number(startingLoc) === 1 ? sourceSeq : Fleur.EmptySequence;
      }
      if (startingLoc <= sourceSeq.childNodes.length) {
        return sourceSeq.childNodes[Number(startingLoc) - 1];
      }
      return Fleur.EmptySequence;
    }
    if (sourceSeq.nodeType !== Fleur.Node.SEQUENCE_NODE) {
      return Number(startingLoc) === 1 ? sourceSeq : Fleur.EmptySequence;
    }
    var seq = new Fleur.Sequence();
    for (var i = Number(startingLoc) - 1, l = Math.min(i + Number(length), sourceSeq.childNodes.length); i < l; i++) {
      seq.appendChild(sourceSeq.childNodes[i]);
    }
    return seq;
  },
  null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.numericTypes}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Node});
*/