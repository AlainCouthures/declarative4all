/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_deep$_equal_2 = {
  need_ctx: false,
  is_async: false,
  return_type: null,
  params_type: [null]
};

Fleur.XPathFunctions_fn["deep-equal#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:deep-equal",
  function(parameter1, parameter2) {
    return Fleur.XPathFunctions_fn["deep-equal#3"].jsfunc(parameter1, parameter2, "http://www.w3.org/2005/xpath-functions/collation/codepoint");
  },
  null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_boolean});

Fleur.XPathFunctions_fn["deep-equal#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:deep-equal",
  function(parameter1, parameter2, collation) {
    var e;
    if (parameter1.nodeType === Fleur.Node.FUNCTION_NODE || parameter2.nodeType === Fleur.Node.FUNCTION_NODE) {
      e = new Error("");
      e.name = "FOTY0015";
      return e;
    }
    var c = Fleur.getCollation(collation);
    if (!c) {
      e = new Error("");
      e.name = "FOCH0002";
      return e;
    }
    if (parameter1.nodeType !== parameter2.nodeType) {
      return false;
    }
    switch (parameter1.nodeType) {
      case Fleur.Node.ELEMENT_NODE:
        if (parameter1.localName !== parameter2.localName || parameter1.namespaceURI !== parameter2.namespaceURI) {
          return false;
        }
        if (parameter1.attributes.some(function(attr) {
          if ((attr.localName === "xmlns" && attr.namespaceURI === "http://www.w3.org/XML/1998/namespace") || attr.namespaceURI === "http://www.w3.org/2000/xmlns/") {
            return false;
          }
          var attr2value = parameter2.getAttributeNS(attr.namespaceURI, attr.localName);
          return !c.equals(attr.textContent, attr2value);
        })) {
          return false;
        }
        var r1 = parameter1.attributes.reduce(function(acc, attr) {
          return (attr.localName === "xmlns" && attr.namespaceURI === "http://www.w3.org/XML/1998/namespace") || attr.namespaceURI === "http://www.w3.org/2000/xmlns/" ? acc : acc + 1;
        }, 0);
        var r2 = parameter2.attributes.reduce(function(acc, attr) {
          return (attr.localName === "xmlns" && attr.namespaceURI === "http://www.w3.org/XML/1998/namespace") || attr.namespaceURI === "http://www.w3.org/2000/xmlns/" ? acc : acc + 1;
        }, 0);
        if (r1 !== r2) {
          return false;
        }
        break;
      case Fleur.Node.ATTRIBUTE_NODE:
        return parameter1.localName === parameter2.localName && parameter1.namespaceURI === parameter2.namespaceURI && c.equals(parameter1.textContent, parameter2.textContent);
      case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
        return parameter1.nodeName === parameter2.nodeName && c.equals(parameter1.data, parameter2.data);
      case Fleur.Node.TEXT_NODE:
        if ((parameter1.schemaTypeInfo === Fleur.Type_string || parameter1.schemaTypeInfo === Fleur.Type_untypedAtomic || parameter1.schemaTypeInfo === Fleur.Type_anyURI) &&
          (parameter2.schemaTypeInfo === Fleur.Type_string || parameter2.schemaTypeInfo === Fleur.Type_untypedAtomic || parameter2.schemaTypeInfo === Fleur.Type_anyURI)) {
          return c.equals(parameter1.data, parameter2.data);
        }
        if (Fleur.numericTypes.indexOf(parameter1.schemaTypeInfo) !== -1 &&
          Fleur.numericTypes.indexOf(parameter2.schemaTypeInfo) !== -1) {
          return (parameter1.data === "INF" && parameter2.data === "INF") ||
            (parameter1.data === "-INF" && parameter2.data === "-INF") ||
            (parameter1.data === "NaN" && parameter2.data === "NaN") ||
            parseFloat(parameter1.data) === parseFloat(parameter2.data);
        }
        return parameter1.schemaTypeInfo === parameter2.schemaTypeInfo && parameter1.data === parameter2.data;
    }
    if (parameter1.childNodes) {
      if (parameter2.childNodes && parameter1.childNodes.length === parameter2.childNodes.length) {
        return parameter1.childNodes.every(function(child, i) {
          return Fleur.XPathFunctions_fn["deep-equal#3"].jsfunc(child, parameter2.childNodes[i], collation);
        });
      }
      return false;
    }
    return true;
  },
  null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Node, occurence: "*"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});