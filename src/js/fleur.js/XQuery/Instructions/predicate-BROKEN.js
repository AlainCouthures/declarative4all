/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.predicate] = function(ctx, children, callback) {
  var next = ctx._next;
  var last;
  var pos = 1;
//console.log("predicate - " + pos + " - " + Fleur.Serializer._serializeNodeToXQuery(next, false, ""));
  var result = Fleur.EmptySequence;
  var subcurr;
  if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
    last = next.childNodes.length;
    subcurr = next.childNodes.shift();
    if (next.childNodes.length === 1) {
      next = next.childNodes[0];
    }
  } else {
    subcurr = next;
    next = Fleur.EmptySequence;
    last = 1;
  }
  var cb = function(n, eob) {
    //console.log("predicate - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + (eob ? " - " + (eob === Fleur.XQueryX.predicate ? "predicate" : eob) : ""));
    if (eob === Fleur.XQueryX.predicate) {
      Fleur.callback(function() {callback(n, Fleur.XQueryX.predicate);});
      return;
    }
    if ((n.nodeType === Fleur.Node.SEQUENCE_NODE && n.childNodes.length !== 0) ||
      (n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_boolean && n.data !== "false") ||
      (n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_integer && parseInt(n.data, 10) === pos) ||
      (n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_string && n.data !== "") ||
      (n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.TEXT_NODE)) {
      if (result === Fleur.EmptySequence) {
        result = subcurr;
      } else {
        if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
          var seq = new Fleur.Sequence();
          seq.childNodes = new Fleur.NodeList();
          seq.children = new Fleur.NodeList();
          seq.textContent = "";
          seq.appendChild(result);
          result = seq;
        }
        result.appendChild(subcurr);
      }
    }
    if (next === Fleur.EmptySequence) {
      if (children.length === 1 || result === Fleur.EmptySequence) {
        Fleur.callback(function() {callback(result, Fleur.XQueryX.predicate);});
        return;
      }
      children.shift();
      next = result;
      result = Fleur.EmptySequence;
      pos = 1;
      if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
        last = next.childNodes.length;
        subcurr = next.childNodes.shift();
        if (next.childNodes.length === 1) {
          next = next.childNodes[0];
        }
      } else {
        subcurr = next;
        next = Fleur.EmptySequence;
        last = 1;
      }
      Fleur.XQueryEngine[children[0][0]]({
            _curr: subcurr,
            _next: next,
            _last: last,
            _pos: pos,
            env: ctx.env
          }, children[0][1], cb);
      return;
    }
    if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
      subcurr = next.childNodes.shift();
      if (next.childNodes.length === 1) {
        next = next.childNodes[0];
      }
    } else {
      subcurr = next;
      next = Fleur.EmptySequence;
    }
    pos++;
    Fleur.XQueryEngine[children[0][0]]({
          _curr: subcurr,
          _next: next,
          _last: last,
          _pos: pos,
          env: ctx.env
        }, children[0][1], cb);
  };
  Fleur.XQueryEngine[children[0][0]]({
        _curr: subcurr,
        _next: next,
        _last: last,
        _pos: pos,
        env: ctx.env
      }, children[0][1], cb);
};