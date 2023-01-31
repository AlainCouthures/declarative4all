/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.orderByClause] = function(ctx, children, callback, resarr, orderkeys, orderkinds) {
  //console.log("orderByClause ");
  orderkeys = orderkeys || [];
  orderkeys.push([]);
  orderkinds = orderkinds || [];
  if (children[0][1].length === 2 && children[0][1][1][1][0][1][0] === "descending") {
    orderkinds.push(-1);
  } else {
    orderkinds.push(1);
  }
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    if (n && n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    } 
    if (children.length <= 1) {
      var kvs = [];
      orderkeys.forEach(function(ks, ki) {
        ks.forEach(function(k, kj) {
          kvs[kj] = kvs[kj] || [];
          kvs[kj][ki] = k;
        });
      }, []);
      resarr.forEach(function(vmgr, i) {
        resarr[i] = {
          kvs: kvs[i],
          resarr: resarr[i]
        };
      });
      resarr.sort(function(a, b) {
        for (var i = 0, l = a.kvs.length; i < l; i++) {
          if (Fleur.ltOp(a.kvs[i], b.kvs[i])) {
            return -orderkinds[i];
          }
          if (Fleur.gtOp(a.kvs[i], b.kvs[i])) {
            return orderkinds[i];
          }
        }
        return 0;
      });
      resarr.forEach(function(o, i) {
        resarr[i] = o.resarr;
      });
      Fleur.callback(function() {callback(n);});
      return;
    } 
    Fleur.XQueryEngine[Fleur.XQueryX.orderByClause](ctx, children.slice(1), callback, resarr, orderkeys);
  }, resarr, orderkeys[orderkeys.length - 1]);
};