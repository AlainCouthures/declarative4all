"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["serialize#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:serialize",
  function(node) {
    return Fleur.XPathFunctions_fn["serialize#2"].jsfunc(node, null);
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});

Fleur.XPathFunctions_fn["serialize#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:serialize",
  function(node, serialization) {
    var contentType;
    var defContentType = null;
    var i, l;
    var defDetect = function(n) {
      switch(n.nodeType) {
        case Fleur.Node.ARRAY_NODE :
        case Fleur.Node.MAP_NODE :
          defContentType = "application/json";
          break;
        case Fleur.Node.TEXT_NODE:
          defContentType = "text/plain";
          break;
        case Fleur.Node.SEQUENCE_NODE:
          defContentType = "text/csv";
          break;
        case Fleur.Node.ELEMENT_NODE:
          defContentType = "application/xml";
      }
    };
    if (node.nodeType === Fleur.Node.DOCUMENT_NODE) {
      for (i = 0, l = node.children.length; i < l && !defContentType; i++) {
        defDetect(node.children[i]);
      }
      for (i = 0, l = node.childNodes.length; i < l && !defContentType; i++) {
        defDetect(node.childNodes[i]);
      }
    } else {
      defDetect(node);
    }
    var indent = false;
    if (serialization) {
      var a2 = Fleur.Atomize(serialization);
      var  op2 = Fleur.toJSObject(a2);
      if (op2[0] < 0) {
        return a2;
      }
      contentType = Fleur.toContentType(op2[1], defContentType);
      indent = op2[1].indent === "yes";
    }
    if (!contentType) {
      contentType = defContentType;
    }
    var ser = new Fleur.Serializer();
    return ser.serializeToString(node, contentType, indent);
  },
  null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});