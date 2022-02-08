"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_forClause = function(children) {
  let result = "";
  const ctx = this;
  let isasync = ctx.async;
  children.forEach(clauseitem => {
    ctx.async = false;
    result += ctx.gen(clauseitem).inst;
    if (!isasync) {
      isasync = ctx.async;
    }
  });
  ctx.async = isasync;
  return {
    inst: result
  };
};

Fleur.XQueryEngine[Fleur.XQueryX.forClause] = function(ctx, children, callback, resarr) {
  //console.log("forClause ");
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n, empty) {
    //console.log("forClause - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + " " + String(empty));
    if (empty) {
      Fleur.callback(function() {callback(n, empty);});
      return;
    }
    if (n && n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    } 
    if (children.length <= 1) {
      Fleur.callback(function() {callback(n);});
      return;
    } 
    Fleur.XQueryEngine[Fleur.XQueryX.forClause](ctx, children.slice(1), callback, resarr);
  }, resarr);
};