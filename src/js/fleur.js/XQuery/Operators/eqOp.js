"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_eqOp = function(children) {
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
  return this.inst("xqx_valueComp(Fleur.eqOp)", false, {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_boolean,
    occurrence: "?"
  }, arg1.inst + arg2.inst);
};

Fleur.eqOp = function(op1, op2, c) {
  if (op1[0] < 4 && op2[0] < 4) {
    return isNaN(Number(op1[1])) && isNaN(Number(op2[1])) || Number(op1[1]) === Number(op2[1]);
  }
  if (op1[0] === 4 && op2[0] === 4) {
    return c.equals(op1[1], op2[1]);
  }
  if (op1[0] === 5 && op2[0] === 5) {
    return op1[1] === op2[1];
  }
  if (op1[0] > 5 && op1[0] < 9 && op2[0] > 5 && op2[0] < 9) {
    var d1 = new Date(op1[1].d.getTime());
    d1.setMinutes(d1.getMinutes() - op1[1].tz);
    var d2 = new Date(op2[1].d.getTime());
    d2.setMinutes(d2.getMinutes() - op2[1].tz);
    return d1.getTime() === d2.getTime();
  }
  if (op1[0] === 9 && op2[0] === 9) {
    return op1[1].sign * (op1[1].year * 12 + op1[1].month) === op2[1].sign * (op2[1].year * 12 + op2[1].month);
  }
  if (op1[0] === 10 && op2[0] === 10) {
    return op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) === op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
  }
  if (op1[0] === 99 && op2[0] === 99) {
    return c.equals(op1[1], op2[1]);
  }
  return false;
};
Fleur.XQueryEngine[Fleur.XQueryX.eqOp] = function(ctx, children, callback) {
  Fleur.XPathTestOpFunction(ctx, children, Fleur.eqOp, callback);
};