"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_lessThanOp = function(children) {
  const arg1 = this.gen(children[0][1][0], Fleur.SequenceType_anyAtomicType_0n);
  const arg2 = this.gen(children[1][1][0], Fleur.SequenceType_anyAtomicType_0n);
  if (!arg2.sequenceType.schemaTypeInfo.as(arg1.sequenceType.schemaTypeInfo) && !arg1.sequenceType.schemaTypeInfo.as(arg2.sequenceType.schemaTypeInfo)) {
    Fleur.XQueryError_xqt("XPST0017", null, "Not compatible types");
  }
  if (arg1.value && arg2.value) {
    return this.staticargs([arg1, arg2]).xqx_generalComp(Fleur.ltOp).staticinst(this);
  }
  return this.inst("xqx_generalComp(Fleur.ltOp)", false, Fleur.SequenceType_boolean_1, arg1.inst + arg2.inst);
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.lessThanOp] = function(ctx, children, callback) {
  Fleur.XPathGenTestOpFunction(ctx, children, Fleur.ltOp, callback);
};
*/