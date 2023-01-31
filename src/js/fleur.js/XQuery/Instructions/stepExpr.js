"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_stepExpr = function(children) {
  let result = "";
  for (let i = 0, l = children.length; i < l; i++) {
    if (children[i][0] !== Fleur.XQueryX.predicates) {
      result += this.gen(children[i]).inst;
    }
  }
  return {
    inst: result,
    sequenceType: null
  };
};

Fleur.XQueryEngine[Fleur.XQueryX.stepExpr] = function(ctx, children, callback) {
  //console.log("stepExpr - 1 - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
  var next;
  var result = Fleur.EmptySequence;
  var cb = function(n, eob) {
    var subcurr;
    if (eob === Fleur.XQueryX.stepExpr) {
      if (n !== Fleur.EmptySequence) {
        if (result === Fleur.EmptySequence || (n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_error)) {
          result = n;
        } else {
          if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
            var seq = new Fleur.Sequence();
            seq.childNodes = new Fleur.NodeList();
            seq.children = new Fleur.NodeList();
            seq.textContent = "";
            seq.appendChild(result);
            result = seq;
          }
          if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
            result.appendChild(n);
          } else {
            n.childNodes.forEach(function(node) {
              result.appendChild(node);
            });
          }
        }
      }
      n = next;
    }
    //console.log("stepExpr - cb - n=" + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + " result=" + Fleur.Serializer._serializeNodeToXQuery(result, false, "") + (eob ? " - " + (eob === Fleur.XQueryX.stepExpr ? "stepExpr" : "predicates") : ""));
    if (n === Fleur.EmptySequence) {
      Fleur.callback(function() {callback(result, Fleur.XQueryX.stepExpr);});
      return;
    }
    //console.log("children.length="+children.length+(children.length === 2?" predicates="+(children[1][0] === Fleur.XQueryX.predicates):""));
    if (children.length === 1) {
      Fleur.callback(function() {callback(n, Fleur.XQueryX.stepExpr);});
      return;
    }
    if (children.length > 1 && (children[1][0] === Fleur.XQueryX.predicates || children[1][0] === Fleur.XQueryX.predicate || children[1][0] === Fleur.XQueryX.lookup)) {
      Fleur.callback(function() {next = Fleur.EmptySequence; cb(n, Fleur.XQueryX.stepExpr);});
      return;
    }
    if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
      subcurr = n.childNodes.shift();
      if (n.childNodes.length === 1) {
        n = n.childNodes[0];
      }
    } else {
      subcurr = n;
      n = Fleur.EmptySequence;
    }
    next = n;
    Fleur.XQueryEngine[Fleur.XQueryX.stepExpr]({
        _curr: subcurr,
        _item: ctx._item,
        env: ctx.env
      }, children.slice(1), cb);
  };
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};