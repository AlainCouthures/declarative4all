"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.xqx_predicateExpr_ = function(ctx, pos, last, item, f) {
  ctx.position = pos;
  ctx.item = item;
  ctx.path = item;
  ctx.last = last;
  f(ctx);
  if (ctx.item.hasNumericType()) {
    if (Number(ctx.item.data) === pos) {
      return item;
    }
    return new Fleur.Sequence();
  }
  if (ctx.fn_boolean_1().item.data === "true") {
    return item;
  }
  return new Fleur.Sequence();
};
Fleur.Context.prototype.xqx_predicateExpr = function(f) {
  if (this.item.isSingle()) {
    const newcontext = this.clone(this.initialpath);
    this.item = Fleur.Context.xqx_predicateExpr_(newcontext, 1, 1, this.item, f);
    return this;
  }
  const seq = new Fleur.Sequence();
  const l = this.item.childNodes.length;
  const children = this.item.childNodes;
  for (let i = 0; i < l; i++) {
    const newcontext = this.clone(this.initialpath);
    const item = Fleur.Context.xqx_predicateExpr_(newcontext, i + 1, l, children[i], f);
    seq.appendChild(item);
  }
  this.item = seq.singleton();
  return this;
};
Fleur.Context.xqx_predicateExpr_async_ = async function(ctx, pos, last, item, f) {
  ctx.position = pos;
  ctx.item = item;
  ctx.path = item;
  ctx.last = last;
  await f(ctx);
  if (ctx.item.hasNumericType()) {
    if (Number(ctx.item.data) === pos) {
      return item;
    }
    return new Fleur.Sequence();
  }
  if (ctx.fn_boolean_1().item.data === "true") {
    return item;
  }
  return new Fleur.Sequence();
};
Fleur.Context.prototype.xqx_predicateExpr_async = async function(f) {
  if (this.item.isSingle()) {
    const newcontext = this.clone(this.initialpath);
    this.item = await Fleur.Context.xqx_predicateExpr_async_(newcontext, 1, 1, this.item, f);
    return this;
  }
  const seq = new Fleur.Sequence();
  const l = this.item.childNodes.length;
  const children = this.item.childNodes;
  for (let i = 0; i < l; i++) {
    const newcontext = this.clone(this.initialpath);
    const item = await Fleur.Context.xqx_predicateExpr_async_(newcontext, i + 1, l, children[i], f);
    seq.appendChild(item);
  }
  this.item = seq.singleton();
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.predicateExpr] = function(ctx, children, callback, resarr, checkvalue) {
  var i = 0;
  var result = new Fleur.Text();
  result.schemaTypeInfo = Fleur.Type_boolean;
  ctx.env.varresolver = resarr[0];
  var cb = function(n) {
    var currvalue = Fleur.XPathFunctions_fn["boolean#1"].jsfunc(n);
    if (currvalue instanceof Error) {
      Fleur.callback(function() {callback(Fleur.error(ctx, currvalue.name, currvalue.message));});
      return;
    }    
    if (currvalue === checkvalue) {
      result.data = String(checkvalue);
      Fleur.callback(function() {callback(result);});
      return;
    }    
    i++;
    if (i !== resarr.length) {
      ctx.env.varresolver = resarr[i];
      Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
    } else {
      result.data = String(!checkvalue);
      Fleur.callback(function() {callback(result);});
    }
  };
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};