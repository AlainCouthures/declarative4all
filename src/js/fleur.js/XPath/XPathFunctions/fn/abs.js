"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_abs_1 = function() {
  if (this.item.isNotEmpty()) {
    const op  = Fleur.toJSValue(this.item, true, false, false, false, false, false);
    if (op[0] >= 0) {
      const a2 = op[1] < 0 ? -op[1] : op[1];
      const t = this.item.schemaTypeInfo;
      const res = new Fleur.Text();
      res.data = String(a2);
      let t2;
      switch (t.getPrimitiveType([Fleur.Type_nonPositiveInteger, Fleur.Type_negativeInteger, Fleur.Type_byte, Fleur.Type_short, Fleur.Type_int, Fleur.Type_long], Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        case Fleur.Type_nonPositiveInteger:
          t2 = Fleur.Type_nonNegativeInteger;
          break;
        case Fleur.Type_negativeInteger:
          t2 = Fleur.Type_positiveInteger;
          break;
        case Fleur.Type_byte:
          t2 = a2 === Fleur.BigInt(128) ? Fleur.Type_short : Fleur.Type_byte;
          break;
        case Fleur.Type_short:
          t2 = a2 === Fleur.BigInt(32768) ? Fleur.Type_int : Fleur.Type_short;
          break;
        case Fleur.Type_int:
          t2 = a2 === Fleur.BigInt(2147483648) ? Fleur.Type_long : Fleur.Type_int;
          break;
        case Fleur.Type_long:
          t2 = a2 === Fleur.BigInt(9223372036854775808) ? Fleur.Type_integer : Fleur.Type_long;
          break;
        default:
          t2 = t;
      }
      res.schemaTypeInfo = t2;
      this.item = res;
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["abs#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:abs", Fleur.Context.prototype.fn_abs_1,
  [Fleur.SequenceType_numeric_01], Fleur.SequenceType_numeric_01);