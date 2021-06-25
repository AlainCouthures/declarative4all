"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_round$_half$_to$_even_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_numeric,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_numeric,
      occurrence: "?"
    }
  ]
};
Fleur.signatures.fn_round$_half$_to$_even_2 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_numeric,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_numeric,
      occurrence: "?"
    },
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_integer,
      occurrence: "1"
    }
  ]
};

Fleur.XPathFunctions_fn["round-half-to-even#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round-half-to-even",
  function(arg) {
    if (arg === null) {
      return [null, null];
    }
    var a = arg[0];
    var t = arg[1];
    var a2, t2;
    if (a - Math.floor(a) === 0.5 && Math.floor(a) % 2 === 0) {
      a -= 1;
    }
    a2 = Math.round(a);
    t2 = t;
    return [a2, t2];
  },
  null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});

Fleur.XPathFunctions_fn["round-half-to-even#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round-half-to-even",
  function(arg, precision) {
    if (arg === null) {
      return [null, null];
    }
    var a = arg[0];
    var t = arg[1];
    var a2;
    a2 = a * Math.pow(10, precision) + Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E) + precision - 15);
    if (a2 === Number.POSITIVE_INFINITY) {
      return [a, t];
    }
    if (a2 === 0) {
      return [0, t];
    }
    if (Math.round(a2 * 2) / 2  - Math.floor(a2) === 0.5 && Math.floor(a2) % 2 === 0) {
      a2 -= 1;
    }
    return [Math.round(a2) * Math.pow(10, -precision), t];
  },
  null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}, {type: Fleur.Type_integer}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});