/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xqx_generalComp = function(f) {
  let arg1 = this.itemstack.pop();
  const arg2 = this.item;
  if (arg1.isEmpty()) {
    this.item = new Fleur.Text();
    this.item.data = "false";
    this.item.schemaTypeInfo = Fleur.Type_boolean;
    return this;
  }
  if (arg1.schemaTypeInfo === Fleur.Type_error) {
    this.item = arg1;
    return this;
  }
  if (arg1.nodeType === Fleur.Node.SEQUENCE_NODE) {
    arg1.childNodes.forEach(function(a) {
      if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1) {
        a.schemaTypeInfo = Fleur.Type_double;
      } else if (a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
        a.schemaTypeInfo = Fleur.Type_string;
      }
    });
  } else {
    if (Fleur.numericTypes.indexOf(arg1.schemaTypeInfo) !== -1) {
      arg1.schemaTypeInfo = Fleur.Type_double;
    } else if (arg1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
      arg1.schemaTypeInfo = Fleur.Type_string;
    }
  }
  if (arg2.isEmpty()) {
    this.item = new Fleur.Text();
    this.item.data = "false";
    this.item.schemaTypeInfo = Fleur.Type_boolean;
    return this;
  }
  if (arg2.schemaTypeInfo === Fleur.Type_error) {
    return this;
  }
  if (arg2.nodeType === Fleur.Node.SEQUENCE_NODE) {
    arg2.childNodes.forEach(a => {
        if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1) {
          a.schemaTypeInfo = Fleur.Type_double;
        } else if (a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
          a.schemaTypeInfo = Fleur.Type_string;
        }
      });
  } else {
    if (Fleur.numericTypes.indexOf(arg2.schemaTypeInfo) !== -1) {
      arg2.schemaTypeInfo = Fleur.Type_double;
    } else if (arg2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
      arg2.schemaTypeInfo = Fleur.Type_string;
    }
  }
  let res = false;
  do {
    let i1;
    if (arg1.nodeType === Fleur.Node.SEQUENCE_NODE) {
      i1 = arg1.childNodes.shift();
      if (arg1.childNodes.length === 1) {
        arg1 = arg1.childNodes[0];
      }
    } else {
      i1 = arg1;
      arg1 = new Fleur.Sequence();
    }
    const op1 = Fleur.toJSValue(i1, true, true, true, true, false, true);
    if (arg2.nodeType === Fleur.Node.SEQUENCE_NODE) {
      for (let b = 0, l = arg2.childNodes.length; b < l && !res; b++) {
        const op2 = Fleur.toJSValue(arg2.childNodes[b], true, true, true, true, false, true);
        res = f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint"));
      }
    } else {
      const op2 = Fleur.toJSValue(arg2, true, true, true, true, false, true);
      res = f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint"));
    }
    if (res) {
      break;
    }
  } while (arg1.isNotEmpty());
  this.item = new Fleur.Text();
  this.item.data = String(res);
  this.item.schemaTypeInfo = Fleur.Type_boolean;
  return this;
};