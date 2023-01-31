"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_instanceOfExpr = function(children) {
  const arg1 = this.gen(children[0][1][0]);
  const seqtype = children[1][1];
  const occurrence = seqtype.length === 2 ? seqtype[1][1][0] : "1";
  return this.inst("xqx_instanceOfExpr(new Fleur.SequenceType(Fleur.Node.ATOMIC_NODE, Fleur.Type_" + seqtype[0][1][0] + ", '" + String(occurrence) + "'))", false, Fleur.SequenceType_boolean_1, arg1.inst);
};

Fleur.Context.prototype.xqx_instanceOfExpr = function(arg) {
  const item = new Fleur.Text();
  item.schemaTypeInfo = Fleur.Type_boolean;
  item.data = String(this.item.instanceOf(arg));
  this.item = item;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.instanceOfExpr] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    var seqtype = children[1][1];
    var occurrence = "1";
    var a = new Fleur.Text();
    a.data = "false";
    a.schemaTypeInfo = Fleur.Type_boolean;
    if (seqtype.length === 2) {
      occurrence = seqtype[1][1][0];
    }
    if (n !== Fleur.EmptySequence) {
      if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
        if (occurrence === "1" || occurrence === "?") {
          a.data = "false";
          Fleur.callback(function() {callback(a);});
        } else {
          var i = 0;
          var l = n.childNodes.length;
          var cb = function(n2) {
            if (n2 === Fleur.EmptySequence) {
              a.data = "false";
              Fleur.callback(function() {callback(a);});
              return;
            }
            i++;
            if (i === l) {
              a.data = "true";
              Fleur.callback(function() {callback(a);});
              return;
            }
            Fleur.XQueryEngine[seqtype[0][0]]({
              _curr: n.childNodes[i],
              env: ctx.env
            }, seqtype[0][1], cb);
          };
          Fleur.XQueryEngine[seqtype[0][0]]({
            _curr: n.childNodes[i],
            env: ctx.env
          }, seqtype[0][1], cb);
        }
      } else {
        Fleur.XQueryEngine[seqtype[0][0]]({
          _curr: n,
          env: ctx.env
        }, seqtype[0][1], function(n) {
          a.data = String(n !== Fleur.EmptySequence);
          Fleur.callback(function() {callback(a);});
        });
      }
    } else {
      a.data = String(occurrence !== "1" && occurrence !== "+");
      Fleur.callback(function() {callback(a);});
    }
  });
};
*/