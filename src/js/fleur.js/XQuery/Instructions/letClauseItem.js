"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_letClauseItem = function(children) {
  const previndent = this.indent;
  this.indent += this.step;
  const gen = this.funcdef(children[1][1][0]);
  this.indent = previndent;
  let result = "\n" + previndent + (this.async ? "await " : "") + this.ctxvarname + ".xqx_letClauseItem" + (this.async ? "_async" : "") + "('" + (children[0][1][0][1][0][1].length === 2 ? children[0][1][0][1][0][1][1][1][0] : "") + "', '" + children[0][1][0][1][0][1][0] + "',";
  result += gen.inst;
  result += "\n" + previndent + ");";
  return {
    inst: result
  };
};

Fleur.Context.prototype.xqx_letClauseItem = function(namespaceURI, vname, fn) {
  this.tuple.forEach(vr => {
    this.rs.varresolver = vr;
    fn(this);
    vr.set(null, namespaceURI, vname, this.item);
  });
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.letClauseItem] = function(ctx, children, callback, resarr) {
  //console.log("letClauseItem");
  var i = 0;
  var varname = children[0][1][0][1][0];
  ctx.env.varresolver = resarr[0];
  var cb = function(n) {
    resarr[i].set(ctx, "", varname, n);
    i++;
    if (i !== resarr.length) {
      ctx.env.varresolver = resarr[i];
      Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
    } else {
      Fleur.callback(function() {callback(Fleur.EmptySequence);});
    }
  };
  Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
};