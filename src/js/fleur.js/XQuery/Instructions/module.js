"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_module = function(children) {
  const transp = this;
  let lastseqtype;
  let r = children.reduce((inst, child) => {
    if (Fleur.XQueryXNames[1][child[0]][0] === 2) {
      return inst;
    }
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
Fleur.XQueryEngine[Fleur.XQueryX.module] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    ctx._result = n;
    if (children.length > 1) {
      Fleur.XQueryEngine[Fleur.XQueryX.module](ctx, children.slice(1), callback);
    } else {
      Fleur.callback(function() {callback(n);});
    }
  });
};
*/