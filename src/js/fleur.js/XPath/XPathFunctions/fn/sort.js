"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_sort_1 = function() {
  return this.emptySequence().emptySequence().fn_sort_3();
};
Fleur.Context.prototype.fn_sort_2 = function() {
  return this.emptySequence().fn_sort_3();
};
Fleur.Context.prototype.fn_sort_3 = function() {
  const collation = this.itemstack.pop();
  const input = this.itemstack.pop();
  if (input.isNotEmpty() && input.nodeType === Fleur.Node.SEQUENCE_NODE) {
    const key = this.item;
    const seq = new Fleur.Sequence();
    seq.childNodes = input.childNodes.slice();
    const v = function(n) {
      if (n.schemaTypeInfo === Fleur.Type_integer) {
        return parseInt(n.data, 10);
      } else if (n.schemaTypeInfo === Fleur.Type_decimal) {
        return parseFloat(n.data);
      } else if (n.schemaTypeInfo === Fleur.Type_float) {
        return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
      } else if (n.schemaTypeInfo === Fleur.Type_double) {
        return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return parseInt(n.data, 10);
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return parseFloat(n.data);
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
      } else if (n.schemaTypeInfo === Fleur.Type_string || n.schemaTypeInfo === Fleur.Type_anyURI || n.schemaTypeInfo === Fleur.Type_untypedAtomic) {
        return n.data;
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return n.data;
      }
    };
    seq.childNodes.sort(function(a, b) {
      if (a.data === b.data) {
        return 0;
      }
      if (v(a) < v(b)) {
        return -1;
      }
      return 1;
    });
    this.item = seq;
  } else {
    this.item = input;
  }
};

Fleur.XPathFunctions_fn["sort#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sort", Fleur.Context.prototype.fn_sort_1,
  [Fleur.SequenceType_item_0n], Fleur.SequenceType_item_0n);

Fleur.XPathFunctions_fn["sort#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sort", Fleur.Context.prototype.fn_sort_2,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_collation_01], Fleur.SequenceType_item_0n);

Fleur.XPathFunctions_fn["sort#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sort", Fleur.Context.prototype.fn_sort_3,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_collation_01, Fleur.SequenceType_function_1], Fleur.SequenceType_item_0n);
/*
  function(input) {
    return Fleur.XPathFunctions_fn["sort#3"].jsfunc(input, null, null);
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});
*/
/*
  function(input, collation) {
    return Fleur.XPathFunctions_fn["sort#3"].jsfunc(input, collation, null);
  },
  null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});
*/
/*
  function(input, collation, key) {
    if (input.nodeType !== Fleur.Node.SEQUENCE_NODE) {
      return Fleur.Atomize(input);
    }
    if (input === Fleur.EmptySequence) {
      return Fleur.EmptySequence;
    }
    var i, l;
    var seq = new Fleur.Sequence();
    var arr = [];
    for (i = 0, l = input.childNodes.length; i < l; i++) {
      arr.push(Fleur.Atomize(input.childNodes[i]));
    }
    var v = function(n) {
      if (n.schemaTypeInfo === Fleur.Type_integer) {
        return parseInt(n.data, 10);
      } else if (n.schemaTypeInfo === Fleur.Type_decimal) {
        return parseFloat(n.data);
      } else if (n.schemaTypeInfo === Fleur.Type_float) {
        return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
      } else if (n.schemaTypeInfo === Fleur.Type_double) {
        return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return parseInt(n.data, 10);
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return parseFloat(n.data);
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
      } else if (n.schemaTypeInfo === Fleur.Type_string || n.schemaTypeInfo === Fleur.Type_anyURI || n.schemaTypeInfo === Fleur.Type_untypedAtomic) {
        return n.data;
      } else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
        return n.data;
      }
    };
    arr.sort(function(a, b) {
      if (a.data === b.data) {
        return 0;
      }
      if (v(a) < v(b)) {
        return -1;
      }
      return 1;
    });
    arr.forEach(function(n) {
      seq.appendChild(n);
    });
    return seq;
  },
  null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node}], false, false, {type: Fleur.Node, occurence: "*"});
*/