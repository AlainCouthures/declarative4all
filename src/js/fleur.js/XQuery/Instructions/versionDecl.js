"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_versionDecl = function(children) {
  const transp = this;
  const r = children.reduce((inst, child) => inst + transp.gen(child).inst, "");
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_empty_sequence
  };
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.versionDecl] = function(ctx, children) {
};
*/