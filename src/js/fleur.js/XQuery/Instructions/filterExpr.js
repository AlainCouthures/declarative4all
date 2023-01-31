"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_filterExpr = function(children) {
  const previndent = this.indent;
  this.indent += this.step;
  const prevasync = this.async;
  this.async = false;
  let result = this.funcdef(children[0]).inst;
  this.indent = previndent;
  result = "\n" + this.indent + (this.async ? "await " : "") + this.ctxvarname + ".xqx_filterExpr" + (this.async ? "_async" : "") + "(" + result;
  this.async = this.async || prevasync;
  return {
    inst: result + "\n" + this.indent + ");",
    sequenceType: null
  };
};

Fleur.Context.prototype.xqx_filterExpr = function(f) {
  if (!this.item || this.item.isSingle()) {
    const ctx = this.clone(this.initialpath);
    ctx.position = 1;
    ctx.item = this.item;
    ctx.path = this.item;
    ctx.last = 1;
    f(ctx);
    this.item = ctx.item;
    return this;
  }
  const seq = new Fleur.Sequence();
  const l = this.item.childNodes.length;
  const children = this.item.childNodes;
  for (let i = 0; i < l; i++) {
    const ctx = this.clone(this.initialpath);
    ctx.position = i + 1;
    ctx.item = children[i];
    ctx.path = children[i];
    ctx.last = l;
    f(ctx);
    seq.appendChild(ctx.item);
  }
  this.item = seq.singleton();
  return this;
};

Fleur.Context.prototype.xqx_filterExpr_async = async function(f) {
  if (!this.item || this.item.isSingle()) {
    const ctx = this.clone(this.initialpath);
    ctx.position = 1;
    ctx.item = this.item;
    ctx.path = this.item;
    ctx.last = 1;
    await f(ctx);
    this.item = ctx.item;
    return this;
  }
  const seq = new Fleur.Sequence();
  const l = this.item.childNodes.length;
  const children = this.item.childNodes;
  for (let i = 0; i < l; i++) {
    const ctx = this.clone(this.initialpath);
    ctx.position = i + 1;
    ctx.item = children[i];
    ctx.path = children[i];
    ctx.last = l;
    await f(ctx);
    seq.appendChild(ctx.item);
  }
  this.item = seq.singleton();
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.filterExpr] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    Fleur.callback(function() {callback(n);});
  });
};