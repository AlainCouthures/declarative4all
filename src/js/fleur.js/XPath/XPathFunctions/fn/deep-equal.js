"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_deep$_equal_2 = function() {
  this.itemstack.push(this.item);
  this.item = new Fleur.Text();
  this.item.data = "http://www.w3.org/2005/xpath-functions/collation/codepoint";
  this.item.schemaTypeInfo = Fleur.Type_collation;
  this.fn_deep$_equal_3();
  return this;
};
Fleur.Context.fn_deep$_equal_3_ = function(parameter1, parameter2, c) {
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
      if (parameter1.schemaTypeInfo.as(Fleur.Type_numeric) && parameter2.schemaTypeInfo.as(Fleur.Type_numeric)) {
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
        return Fleur.Context.fn_deep$_equal_3_(child, parameter2.childNodes[i], c);
      });
    }
    return false;
  }
  return true;
};
Fleur.Context.prototype.fn_deep$_equal_3 = function() {
  const collation = this.item;
  const parameter2 = this.itemstack.pop();
  const parameter1 = this.itemstack.pop();
  const c = Fleur.getCollation(collation.data);
  if (parameter1.nodeType === Fleur.Node.FUNCTION_NODE || parameter2.nodeType === Fleur.Node.FUNCTION_NODE) {
    Fleur.XQueryError_xqt("FOTY0015", null, "Functions cannot be compared");
  }
  const newitem = new Fleur.Text();
  newitem.schemaTypeInfo = Fleur.Type_boolean;
  newitem.data = String(Fleur.Context.fn_deep$_equal_3_(parameter1, parameter2, c));
  this.item = newitem;
  return this;
};

Fleur.XPathFunctions_fn["deep-equal#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:deep-equal", Fleur.Context.prototype.fn_deep$_equal_2,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_item_0n], Fleur.SequenceType_boolean_1);
/*
  function(parameter1, parameter2) {
    return Fleur.XPathFunctions_fn["deep-equal#3"].jsfunc(parameter1, parameter2, "http://www.w3.org/2005/xpath-functions/collation/codepoint");
  },
  null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_boolean});
*/

Fleur.XPathFunctions_fn["deep-equal#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:deep-equal", Fleur.Context.prototype.fn_deep$_equal_3,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_item_0n, Fleur.SequenceType_string_1], Fleur.SequenceType_boolean_1);
/*
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
*/