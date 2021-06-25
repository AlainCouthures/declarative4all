/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.treatExpr] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    var seqtype = children[1][1];
    var occurrence = "1";
    var e = Fleur.error(ctx, "XPDY0050");
    if (seqtype.length === 2) {
      occurrence = seqtype[1][1][0];
    }
    if (n !== Fleur.EmptySequence) {
      if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
        if (occurrence === "1" || occurrence === "?") {
          Fleur.callback(function() {callback(e);});
        } else {
          var i = 0;
          var l = n.childNodes.length;
          var cb = function(n2) {
            if (n2 === Fleur.EmptySequence) {
              Fleur.callback(function() {callback(e);});
              return;
            }
            i++;
            if (i === l) {
              Fleur.callback(function() {callback(n);});
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
        }, seqtype[0][1], function(n2) {
          Fleur.callback(function() {callback(n2 !== Fleur.EmptySequence ? n : e);});
        });
      }
    } else if (occurrence === "1" || occurrence === "+") {
      Fleur.callback(function() {callback(e);});
    }
  });
};