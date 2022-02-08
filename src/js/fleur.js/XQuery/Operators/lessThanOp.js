"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_lessThanOp = function(children) {
  const arg1 = this.gen(children[0][1][0], {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "?"
  });
  const arg2 = this.gen(children[1][1][0], {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_string,
    occurrence: "?"
  });
  if (!arg2.sequenceType.schemaTypeInfo.as(arg1.sequenceType.schemaTypeInfo) && !arg1.sequenceType.schemaTypeInfo.as(arg2.sequenceType.schemaTypeInfo)) {
    Fleur.XQueryError_xqt("XPST0017", null, "Not compatible types");
  }
  return this.inst("xqx_generalComp(Fleur.ltOp)", false, {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_boolean,
    occurrence: "?"
  }, arg1.inst + arg2.inst);
};

Fleur.XQueryEngine[Fleur.XQueryX.lessThanOp] = function(ctx, children, callback) {
  Fleur.XPathGenTestOpFunction(ctx, children, Fleur.ltOp, callback);
};