"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_letClause = function(children) {
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
/*
Fleur.XQueryEngine[Fleur.XQueryX.letClause] = function(ctx, children, callback, resarr) {
  //console.log("letClause ");
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    if (n && n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    } 
    if (children.length <= 1) {
      Fleur.callback(function() {callback(n);});
      return;
    } 
    Fleur.XQueryEngine[Fleur.XQueryX.letClause](ctx, children.slice(1), callback, resarr);
  }, resarr);
};
*/