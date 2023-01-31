"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_prolog = function(children) {
  const transp = this;
  let lastseqtype;
  let r = children.reduce((inst, child) => {
    const g = transp.gen(child);
    lastseqtype = g.sequenceType;
    return inst + g.inst;
  }, "");
  return {
    inst: r,
    sequenceType: lastseqtype
  };
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.prolog] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    if (children.length > 1) {
      Fleur.XQueryEngine[Fleur.XQueryX.prolog](ctx, children.slice(1), callback);
    } else {
      ctx.env.varresolver.globals = ctx.env.varresolver.length;
      Fleur.callback(function() {callback(n);});
    }
  });
};
*/