"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Serializer = function() {};
/**
 * @name Fleur.Serializer.escapeXML
 * @description description
 * @function
 * @param s {string}
 * @returns {string}
 */
Fleur.Serializer.escapeXML = function(s, quotes, inline) {
  var i = 0, c, code, l = s.length, r = "";
  while (i < l) {
    c = s.charAt(i);
    switch (c) {
      case '&':
        r += '&amp;';
        break;
      case '<':
        r += '&lt;';
        break;
      case '>':
        r += '&gt;';
        break;
      case "'":
        r += '&apos;';
        break;
      case '"':
        r += quotes ? '&quot;' : '"';
        break;
      default:
        code = c.charCodeAt(0);
        if ((!inline && (code === 9 || code === 10 || code === 13)) || (code > 31 && code < 127)) {
          r += c;
        } else {
          r += '&#' + code + ';';
        }
    }
    i++;
  }
  return r;
};
Fleur.Serializer._serializeXMLToString = function(node, indent, offset, knownns) {
  var s, i, l, index, nsl;
  knownns = knownns || {pf: [], uri: []};
  switch (node.nodeType) {
    case Fleur.Node.ELEMENT_NODE:
      s = (indent ? offset + "<" : "<") + node.nodeName;
      nsl = knownns.pf.length;
      if (indent) {
        var names = [];
        for (i = 0, l = node.attributes.length; i < l; i++) {
          names.push(node.attributes[i].nodeName);
        }
        names.sort();
        for (i = 0, l = names.length; i < l; i++) {
          if (names[i] === "xmlns") {
            index = knownns.pf.lastIndexOf(" ");
            if (index !== -1 && knownns.uri[index] === node.getAttribute(names[i])) {
              continue;
            }
            knownns.pf.push(" ");
            knownns.uri.push(node.getAttribute(names[i]));
          } else if (node.getAttributeNode(names[i]).namespaceURI === "http://www.w3.org/2000/xmlns/") {
            index = knownns.pf.lastIndexOf(node.getAttributeNode(names[i]).localName);
            if (index !== -1 && knownns.uri[index] === node.getAttributeNode(names[i]).nodeValue) {
              continue;
            }
            knownns.pf.push(node.getAttributeNode(names[i]).localName);
            knownns.uri.push(node.getAttributeNode(names[i]).nodeValue);
          }
          s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i]), true) + "\"";
        }
      } else {
        for (i = 0, l = node.attributes.length; i < l; i++) {
          if (node.attributes[i].nodeName === "xmlns") {
            index = knownns.pf.lastIndexOf(" ");
            if (index !== -1 && knownns.uri[index] === node.attributes[i].nodeValue) {
              continue;
            }
            knownns.pf.push(" ");
            knownns.uri.push(node.attributes[i].nodeValue);
          } else if (node.attributes[i].namespaceURI === "http://www.w3.org/2000/xmlns/") {
            index = knownns.pf.lastIndexOf(node.attributes[i].localName);
            if (index !== -1 && knownns.uri[index] === node.attributes[i].nodeValue) {
              continue;
            }
            knownns.pf.push(node.attributes[i].localName);
            knownns.uri.push(node.attributes[i].nodeValue);
          }
          s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue, true) + "\"";
        }
      }
      if (node.childNodes.length === 0) {
        knownns.pf.length = nsl;
        knownns.uri.length = nsl;
        return s + (indent ? "/>\n" : "/>");
      }
      s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset + "  ", knownns);
      }
      knownns.pf.length = nsl;
      knownns.uri.length = nsl;
      return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName + (indent ? ">\n" : ">");
    case Fleur.Node.TEXT_NODE:
      if ((indent || (node.ownerDocument && node === node.ownerDocument.firstChild)) && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
        return "";
      }
      return Fleur.Serializer.escapeXML(node.data);
    case Fleur.Node.CDATA_NODE:
      return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
    case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
      return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.data + (indent ? "?>\n" : "?>");
    case Fleur.Node.COMMENT_NODE:
      return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
    case Fleur.Node.SEQUENCE_NODE:
      s = "";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset, knownns);
      }
      return s;
    case Fleur.Node.DOCUMENT_NODE:
      s = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset);
      }
      return s;
  }
};
Fleur.Serializer._serializeHTMLToString = function(node, indent, offset) {
  var s, i, l;
  switch (node.nodeType) {
    case Fleur.Node.ELEMENT_NODE:
      s = "";
      if (node.localName.toLowerCase() === "html") {
        s += indent ? "<!DOCTYPE html>\n" : "<!DOCTYPE html>";
      }
      s += (indent ? offset + "<" : "<") + node.localName.toLowerCase();
      if (indent) {
        var names = [];
        for (i = 0, l = node.attributes.length; i < l; i++) {
          if (node.attributes[i].localName !== "xmlns" && node.attributes[i].prefix !== "xmlns") {
            names.push(node.attributes[i].localName.toLowerCase());
          }
        }
        names.sort();
        for (i = 0, l = names.length; i < l; i++) {
          s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i]), true) + "\"";
        }
      } else {
        for (i = 0, l = node.attributes.length; i < l; i++) {
          if (node.attributes[i].localName !== "xmlns" && node.attributes[i].prefix !== "xmlns") {
            s += " " + node.attributes[i].localName.toLowerCase() + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue, true) + "\"";
          }
        }
      }
      if (node.childNodes.length === 0) {
        if (["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"].indexOf(node.localName.toLowerCase()) !== -1) {
          return s + (indent ? ">\n" : ">");
        }
        return s + (indent ? "></" + node.localName.toLowerCase() + ">\n" : "></" + node.localName.toLowerCase() + ">");
      }
      s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeHTMLToString(node.childNodes[i], indent, offset + "  ");
      }
      return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName.toLowerCase() + (indent ? ">\n" : ">");
    case Fleur.Node.TEXT_NODE:
      if (indent && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
        return "";
      }
      return node.parentNode.localName && ["script", "style"].indexOf(node.parentNode.localName.toLowerCase()) !== -1 ? node.data : Fleur.Serializer.escapeXML(node.data);
    case Fleur.Node.CDATA_NODE:
      return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
    case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
      return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.data + (indent ? "?>\n" : "?>");
    case Fleur.Node.COMMENT_NODE:
      return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
    case Fleur.Node.DOCUMENT_NODE:
      s = "";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeHTMLToString(node.childNodes[i], indent, offset);
      }
      return s;
  }
};
Fleur.Serializer._serializeSequenceTypeToXQuery = function(sequenceType) {
  const fschemaTypeInfo = sequenceType ? sequenceType.schemaTypeInfo : null;
  return fschemaTypeInfo ? (
    sequenceType === Fleur.SequenceType_empty_sequence ? "empty-sequence()" :
    sequenceType === Fleur.SequenceType_document_1 ? "document()" :
    sequenceType === Fleur.SequenceType_element_1 ? "element()" :
    sequenceType === Fleur.SequenceType_attribute_1 ? "attribute()" :
    sequenceType === Fleur.SequenceType_processing_instruction_1 ? "processing-instruction()" :
    sequenceType === Fleur.SequenceType_comment_01 ? "comment()?" :
    sequenceType === Fleur.SequenceType_map_1 ? "map()" :
    sequenceType === Fleur.SequenceType_entry_1 ? "entry()" :
    (fschemaTypeInfo.typeNamespace === "http://www.w3.org/2001/XMLSchema" ? "xs:" : "Q{" + fschemaTypeInfo.typeNamespace + "}") + fschemaTypeInfo.typeName + (sequenceType.occurrence === "1" ? "" : sequenceType.occurrence)) :
    "none";
};
Fleur.Serializer._serializeNodeToXQuery = function(node, indent, offset, tree, postfix, inmap, defquot) {
  var s, i, l;
  postfix = postfix || "";
  defquot = defquot || "'";
  switch (node.nodeType) {
    case Fleur.Node.ELEMENT_NODE:
      s = (indent ? offset + "<" : "<") + node.nodeName;
      if (indent) {
        var names = [];
        for (i = 0, l = node.attributes.length; i < l; i++) {
          names.push(node.attributes[i].nodeName);
        }
        names.sort();
        for (i = 0, l = names.length; i < l; i++) {
          s += " " + names[i] + "=" + defquot + Fleur.Serializer.escapeXML(node.getAttribute(names[i]), true, false) + defquot;
        }
      } else {
        for (i = 0, l = node.attributes.length; i < l; i++) {
          s += " " + node.attributes[i].nodeName + "=" + defquot + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue, true, true) + defquot;
        }
      }
      if (node.childNodes.length === 0) {
        return s + (indent ? "/>" + postfix + "\n" : "/>" + postfix);
      }
      s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", true, null, null, defquot);
      }
      return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName + ">" + postfix + (indent ? "\n" : "");
    case Fleur.Node.SEQUENCE_NODE:
      if (node.rowlabels || node.collabels) {
        s = (indent ? offset : "") + "matrix:labels(";
        var seriarr = function(arr) {
          if (!arr) {
            return "()";
          }
          if (arr.length === 1) {
            return defquot + arr[0] + defquot;
          }
          var sarr = "";
          arr.forEach(function(l, index) {
            sarr += (index !== 0 ? ", " : "") + defquot + l + defquot;
          });
          return "(" +  sarr + ")";
        };
        s += seriarr(node.rowlabels) + ", ";
        s += seriarr(node.collabels) + ", (";
      } else {
        s = indent ? offset + "(" : "(";
      }
      if (node.childNodes.length === 0) {
        return s + (indent ? ")\n" : ")");
      }
      s += indent ? "\n" : "";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", false, i !== l - 1 ? node.childNodes[i].nodeType === Fleur.Node.MULTIDIM_NODE ? ";" : "," : "", null, defquot);
      }
      if (node.rowlabels || node.collabels) {
        return s + (indent ? offset + "))\n" : "))");
      }
      return s + (indent ? offset + ")\n" : ")");
    case Fleur.Node.MULTIDIM_NODE:
      s = indent ? offset : "";
      if (node.childNodes.length === 0) {
        return s + (indent ? "\n" : "");
      }
      s += indent ? "\n" : "";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", false, i !== l - 1 ? "," : "", null, defquot);
      }
      return s + (indent ? offset + postfix + "\n" : postfix);
    case Fleur.Node.ATTRIBUTE_NODE:
      return (indent ? offset : "") + "attribute " + (node.namespaceURI && node.namespaceURI !== "" ? "Q{" + node.namespaceURI + "}" : "") + node.localName + " {" + defquot + Fleur.Serializer.escapeXML(node.value).replace(/"/gm, "\"\"") + defquot + "}" + postfix + (indent ? "\n" : "");
    case Fleur.Node.FUNCTION_NODE:
      return (indent ? offset : "") + node.nodeName + "#" + String(node.argtypes.length);
    case Fleur.Node.MAP_NODE:
      s = (indent ? offset : "") + "map {"; 
      if (node.entries.length === 0) {
        return s + "}" + (indent ? "\n" : "");
      }
      s += indent ? "\n" : "";
      for (i = 0, l = node.entries.length; i < l; i++) {
        s += Fleur.Serializer._serializeNodeToXQuery(node.entries[i], indent, offset + "  ", false, i !== l - 1 ? ", " : "", true, null, defquot);
      }
      return s + "}" + postfix + (indent ? "\n" : "");
    case Fleur.Node.ARRAY_NODE:
      s = (indent ? offset : "") + "array {"; 
      if (node.childNodes.length === 0) {
        return s + "}" + (indent ? "\n" : "");
      }
      s += indent ? "\n" : "";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", false, i !== l - 1 ? "," : "", null, defquot);
      }
      return s + "}" + postfix + (indent ? "\n" : "");
    case Fleur.Node.ENTRY_NODE:
      if (inmap) {
        return (indent ? offset : "") + defquot + node.nodeName + defquot + ": " + Fleur.Serializer._serializeNodeToXQuery(node.firstChild, indent, offset + "  ", false, null, null, defquot) + postfix + (indent ? "\n" : "");
      }
      return (indent ? offset : "") + "entry " + node.nodeName + " {" + Fleur.Serializer._serializeNodeToXQuery(node.firstChild, indent, offset + "  ", false, null, null, defquot) + "}" + postfix + (indent ? "\n" : "");
    case Fleur.Node.TEXT_NODE:
      var typeName;
      var prefix;
      if (node.schemaTypeInfo) {
        var nres = new Fleur.XPathNSResolver(node);
        typeName = node.schemaTypeInfo.typeName;
        prefix = nres.lookupPrefix(node.schemaTypeInfo.typeNamespace);
      } else {
        typeName = "untypedAtomic";
        prefix = "xs";
      }
      if (tree) {
        if (indent && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
          return "";
        }
        return Fleur.Serializer.escapeXML(node.data, !indent, !indent);
      }
      if (node.schemaTypeInfo === Fleur.Type_error) {
        var errmess = Fleur.noErrorMessage ? null : node.textContent;
        return "fn:error(fn:QName(" + defquot + node.namespaceURI + defquot + ", " + defquot + node.nodeName + defquot + ")" + (errmess ? "," + defquot + Fleur.Serializer.escapeXML(errmess, false, false).replace(/"/gm, "\"\"") + defquot + "" : "") + ")" + postfix;
      }
      if (node.schemaTypeInfo === Fleur.Type_QName) {
        return "fn:QName(" + defquot + node.namespaceURI + defquot + ", " + defquot + node.nodeName + defquot + ")" + postfix;
      }
      //var fdata = node.data;
      //if (fdata !== "INF" && fdata !== "-INF" && fdata !== "NaN") {
      //  if (node.schemaTypeInfo === Fleur.Type_float || node.schemaTypeInfo === Fleur.Type_double) {
      //    if (fdata.indexOf("E") === -1) {
      //      if (fdata !== "0") {
      //        var exp = Math.floor(Math.log(Math.abs(parseFloat(fdata))) * Math.LOG10E);
      //        fdata = String(parseFloat(fdata) * Math.pow(10, -exp)) + "E" + exp;
      //      }
      //    }
      //    if (fdata.indexOf(".") === -1) {
      //      fdata = fdata.split("E");
      //      fdata = fdata[0] + ".0E" + fdata[1];
      //    }
      //  } else if (node.schemaTypeInfo === Fleur.Type_decimal && fdata.indexOf(".") === -1) {
      //    fdata += ".0";
      //  }
      //}
      return (indent ? offset : "") + prefix + ":" + typeName + "(" + defquot + Fleur.Serializer.escapeXML(node.data, !indent, !indent).replace(/\'/gm, "\'\'") + defquot + ")" + postfix + (indent ? "\n" : "");
    case Fleur.Node.CDATA_NODE:
      return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
    case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
      return (indent ? offset + "<?" : "<?") + node.nodeName + (node.data ? " " + Fleur.Serializer.escapeXML(node.data, false, false).replace(/"/gm, "\"\"") : "") + "?>" + postfix + (indent ? "\n" : "");
    case Fleur.Node.COMMENT_NODE:
      return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
    case Fleur.Node.DOCUMENT_NODE:
      if (node.childNodes.length === 0) {
        return "document {}";
      }
      s = 'document {';
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset, true, null, null, defquot);
      }
      return s + "}" + postfix;
  }
};
Fleur.Serializer._serializeEXMLToString = function(node, indent, offset) {
  var s, i, l, nodeName, isqname;
  switch (node.nodeType) {
    case Fleur.Node.ELEMENT_NODE:
    case Fleur.Node.ENTRY_NODE:
      isqname = node.nodeType === Fleur.Node.ELEMENT_NODE && Fleur.Node.QNameReg.test(node.nodeName);
      nodeName = isqname ? node.nodeName : "exml:" + (node.nodeType === Fleur.Node.ELEMENT_NODE ? "element" : "entry");
      s = (indent ? offset + "<" : "<") + nodeName;
      if (!isqname) {
        s += " name=\"" + Fleur.Serializer.escapeXML(node.nodeName) + "\"";
      }
      if (node.attributes) {
        if (indent) {
          var names = [];
          for (i = 0, l = node.attributes.length; i < l; i++) {
            names.push(node.attributes[i].nodeName);
          }
          names.sort();
          for (i = 0, l = names.length; i < l; i++) {
            s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i])) + "\"";
          }
        } else {
          for (i = 0, l = node.attributes.length; i < l; i++) {
            s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue) + "\"";
          }
        }
      }
      if (node.childNodes.length === 0) {
        return s + (indent ? "/>\n" : "/>");
      }
      s += indent ? ">\n" : ">";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeEXMLToString(node.childNodes[i], indent, offset + "  ");
      }
      return s + (indent ? offset + "</" : "</") + nodeName + (indent ? ">\n" : ">");
    case Fleur.Node.TEXT_NODE:
      s = indent ? offset + '<exml:atom' : '<exml:atom';
      return s +  ' type="Q{' + node.schemaTypeInfo.typeNamespace + '}' + node.schemaTypeInfo.typeName + '">' + Fleur.Serializer.escapeXML(node.data) + (indent ? "</exml:atom>\n" : "</exml:atom>");
    case Fleur.Node.CDATA_NODE:
      return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
    case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
      return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.data + (indent ? "?>\n" : "?>");
    case Fleur.Node.COMMENT_NODE:
      return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
    case Fleur.Node.DOCUMENT_NODE:
      s = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
      s += '<exml:document xmlns:exml="http://www.agencexml.com/exml">' + (indent ? "\n" : "");
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeEXMLToString(node.childNodes[i], indent, "  ");
      }
      return  s + "</exml:document>";
    case Fleur.Node.ARRAY_NODE:
      s = indent ? offset + "<exml:array" : "<exml:array";
      if (node.childNodes.length === 0) {
        return s + (indent ? "/>\n" : "/>");
      }
      s += indent ? ">\n" : ">";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeEXMLToString(node.childNodes[i], indent, offset + "  ");
      }
      return s + (indent ? offset + "</" : "</") + "exml:array" + (indent ? ">\n" : ">");
    case Fleur.Node.MAP_NODE:
      s = indent ? offset + "<exml:map" : "<exml:map";
      if (node.entries.length === 0) {
        return s + (indent ? "/>\n" : "/>");
      }
      s += indent ? ">\n" : ">";
      for (i = 0, l = node.entries.length; i < l; i++) {
        s += Fleur.Serializer._serializeEXMLToString(node.entries[i], indent, offset + "  ");
      }
      return s + (indent ? offset + "</exml:map>\n" : "</exml:map>");
  }
};
/**
 * @name Fleur.Serializer.escapeJSON
 * @description description
 * @function
 * @param s {string}
 * @returns {string}
 */
Fleur.Serializer.escapeJSON = function(s) {
  var i = 0, c, code, l = s.length, r = "";
  while (i < l) {
    c = s.charAt(i);
    switch (c) {
      case '\t':
        r += '\\t';
        break;
      case '\n':
        r += '\\n';
        break;
      case '\r':
        r += '\\r';
        break;
      case '\\':
        r += '\\\\';
        break;
      case '"':
        r += '\\"';
        break;
      default:
        code = c.charCodeAt(0);
        if (code > 31 && code < 127) {
          r += c;
        } else {
          r += '\\u' + ('000' + code.toString(16)).slice(-4);
        }
    }
    i++;
  }
  return r;
};
Fleur.Serializer._serializeJSONToString = function(node, indent, offset, inline, comma) {
  var s, i, l, quote;
  switch (node.nodeType) {
    case Fleur.Node.MAP_NODE:
      s = indent && !inline ? offset + "{" : "{";
      if (node.entries.length === 0) {
        return s + (indent ? "}" + comma + "\n" : "}" + comma);
      }
      if (indent) {
        s += "\n";
      }
      if (indent) {
        var names = [];
        for (i = 0, l = node.entries.length; i < l; i++) {
          names.push(node.entries[i].nodeName);
        }
        names.sort();
        for (i = 0, l = names.length; i < l; i++) {
          s += Fleur.Serializer._serializeJSONToString(node.getEntryNode(names[i]), indent, offset + "  ", false, (i === l - 1 ? "" : ","));
        }
      } else {
        for (i = 0, l = node.entries.length; i < l; i++) {
          s += Fleur.Serializer._serializeJSONToString(node.entries[i], indent, offset + "  ", false, (i === l - 1 ? "" : ","));
        }
      }
      return s + (indent ? offset + "}" + comma + "\n" : "}" + comma);
    case Fleur.Node.ENTRY_NODE:
      if (indent && Fleur.Node.JSNameReg.test(node.nodeName)) {
        s = offset + node.nodeName + ": ";
      } else {
        s = (indent ? offset + '"' : '"') + Fleur.Serializer.escapeJSON(node.nodeName) + '":' + (indent ? " " : "");
      }
      s += Fleur.Serializer._serializeJSONToString(node.firstChild, indent, offset, true, comma);
      return s;
    case Fleur.Node.TEXT_NODE:
      quote = node.schemaTypeInfo === Fleur.Type_string  || node.schemaTypeInfo === Fleur.Type_untypedAtomic ? '"' : node.schemaTypeInfo === Fleur.Type_regex ? '/' : "";
      return (indent && !inline ? offset + quote : quote) + Fleur.Serializer.escapeJSON(node.data) + quote + comma + (indent ? "\n" : "");
    case Fleur.Node.ARRAY_NODE:
    case Fleur.Node.SEQUENCE_NODE:
      s = indent && !inline ? offset + "[" : "[";
      if (node.childNodes.length === 0) {
        return s + (indent ? "]" + comma + "\n" : "]" + comma);
      }
      if (indent) {
        s += "\n";
      }
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeJSONToString(node.childNodes[i], indent, offset + "  ", false, (i === l - 1 ? "" : ","));
      }
      return s + (indent ? offset + "]" + comma + "\n" : "]" + comma);
    case Fleur.Node.DOCUMENT_NODE:
      s = "";
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        s += Fleur.Serializer._serializeJSONToString(node.childNodes[i], indent, offset, false, "");
      }
      return s;
  }
};
Fleur.Serializer.escapeCSV = function(s, sep) {
  if (s.indexOf(sep) !== -1) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
};
Fleur.Serializer._serializeMatrixToString = function(node, head, sep) {
  var s;
  if (head && node.collabels) {
    s = node.collabels.join(sep) + "\n";
  } else {
    s = "";
  }
  var seq2string = function(seq) {
    seq.childNodes.forEach(function(n, index) {
      s += (index !== 0 ? sep : "") + n.data;
    });
    s += "\n";
  };
  if (node.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
    node.childNodes.forEach(seq2string);
  } else {
    seq2string(node);
  }
  return s;
};
Fleur.Serializer._serializeCSVToString = function(node, head, key, sep, level) {
  var s = "", s2, s3, i, l, rowname, nextlevel = level, headref;
  switch (node.nodeType) {
    case Fleur.Node.ELEMENT_NODE:
    case Fleur.Node.ARRAY_NODE:
    case Fleur.Node.DOCUMENT_NODE:
      if (node.childNodes.length === 0) {
        nextlevel = 2;
      } else if (node.nodeType !== Fleur.Node.DOCUMENT_NODE || node.childNodes[0].nodeType === Fleur.Node.ARRAY_NODE) {
        nextlevel = level + 1;
      }
      if (node.childNodes.length > 1 && nextlevel < 2) {
        l = node.childNodes.length;
        i = 1;
        rowname = node.childNodes[0].nodeName;
        while (i < l) {
          if (rowname !== node.childNodes[i].nodeName) {
            nextlevel++;
            break;
          }
          i++;
        }
      }
      if (head && level === 0 && nextlevel !== 0) {
        if (key !== null) {
          headref = node.childNodes[0].entries[0];
          l = headref.childNodes.length;
          i = 0;
          while (i < l) {
            if (s !== "") {
              s += sep;
            }
            if (i === key) {
              s += node.nodeName + sep;
            }
            s += headref.childNodes[i].nodeName;
            i++;
          }
          if (l === key) {
            if (s !== "") {
              s += sep;
            }
            s += node.nodeName;
          }
          head = false;
        } else {
          if (node.childNodes.length !== 0) {
            headref = nextlevel === level + 1 ? node.childNodes[0] : node;
            l = headref.childNodes.length;
            i = 0;
            while (i < l) {
              if (s !== "") {
                s += sep;
              }
              s += headref.childNodes[i].nodeName;
              i++;
            }
          } else {
            s  = node.nodeName;
          }
        }
        s += "\n";
      }
      l = node.childNodes.length;
      i = 0;
      s3 = "";
      while (i < l) {
        s2 = Fleur.Serializer._serializeCSVToString(node.childNodes[i], key ? head : level === 0, key, sep, nextlevel);
        if (s2) {
          if (s3 !== "") {
            s3 += nextlevel === 1 ? "\n" : ((nextlevel - level === 2 || node.nodeType === Fleur.Node.ARRAY_NODE) ? sep : "");
          }
          s3 += s2;
        }
        i++;
      }
      return s + s3;
    case Fleur.Node.SEQUENCE_NODE:
      return null;
    case Fleur.Node.MAP_NODE:
      l = node.entries.length;
      i = 0;
      while (i < l) {
        s += Fleur.Serializer._serializeCSVToString(node.entries[i], false, key, sep, nextlevel) + "\n";
        i++;
      }
      return s;
    case Fleur.Node.ENTRY_NODE:
      l = node.childNodes.length;
      i = 0;
      s3 = "";
      while (i < l) {
        if (i === key) {
          if (s3 !== "") {
            s3 += sep;
          }
          s3 += Fleur.Serializer.escapeCSV(node.nodeName);
        }
        s2 = Fleur.Serializer._serializeCSVToString(node.childNodes[i], false, key, sep, nextlevel);
        if (s2) {
          if (s3 !== "") {
            s3 += sep;
          }
          s3 += s2;
        }
        i++;
      }
      return s + s3;
    case Fleur.Node.TEXT_NODE:
      if (head && level !== 2) {
        s = (node.parentNode ? Fleur.Serializer.escapeCSV(node.nodeName) : "#text") + "\n";
      }
      s += Fleur.Serializer.escapeCSV(node.data);
      return s;
    default:
      return null;
  }
};
Fleur.Serializer.XQX_delimitedList = function(node, delimiter, leftEncloser, rightEncloser, selector) {
  var s = leftEncloser, i = 0, l = node.childNodes.length;
  while (i < l) {
    Fleur.Serializer._serializeXQXToString(node.childNodes[i]);
    i++;
    if (i !== l) {
      s += delimiter;
    }
  }
  return s + rightEncloser;
};
Fleur.Serializer.XQX_parenthesizedList = function(node, delimiter) {
  delimiter = delimiter || ", ";
  return Fleur.Serializer.XQX_delimitedList(node, delimiter, "(", ")");
};
Fleur.Serializer.XQX_commaSeparatedList = function(node) {
  return Fleur.Serializer.XQX_delimitedList(node, ", ");
};
Fleur.Serializer.XQX_quote = function(item) {
  return '"' + item.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\x85/g, "&amp;#x85;").replace(/\x2028/g, "&#x2028;").replace (/\"/g, '""') + '"';
};
Fleur.Serializer.XQX_renderQName = function(node) {
  return (node.hasAttributeNS("http://www.w3.org/2005/XQueryX", "prefix") ? node.getAttributeNS("http://www.w3.org/2005/XQueryX", "prefix") + ":" : "") + node.textContent;
};
Fleur.Serializer.XQX_renderEQName = function(node) {
  if (node.localName === "elementConstructor" && node.namespaceURI === "http://www.w3.org/2005/XQueryX") {
    var i = 0, l = node.children.length;
    while (i < l) {
      if (node.children[i].localName === "tagName" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
        return Fleur.Serializer.XQX_renderQName(node.children[i]);
      }
      i++;
    }
  }
  if (node.hasAttributeNS("http://www.w3.org/2005/XQueryX", "prefix")) {
    return node.getAttributeNS("http://www.w3.org/2005/XQueryX", "prefix") + ":" + node.textContent;
  }
  if (node.hasAttributeNS("http://www.w3.org/2005/XQueryX", "URI")) {
    return "Q{" + node.getAttributeNS("http://www.w3.org/2005/XQueryX", "URI") + "}" + node.textContent;
  }
  return node.textContent;
};
Fleur.Serializer.XQX_renderChildren = function(node, filter) {
  var i = 0, l, s = "";
  l = node.children.length;
  while (i < l) {
    if (!filter || (filter.indexOf(node.children[i].localName) !== -1 && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX")) {
      s += Fleur.Serializer._serializeXQXToString(node.children[i]);
    }
    i++;
  }
  return s;
};
Fleur.Serializer.XQX_ops = {
  "unaryMinusOp": "-",
  "unaryPlusOp": "+",
  "addOp": "+",
  "subtractOp": " - ",
  "multiplyOp": "*",
  "divOp": " div ",
  "idivOp": " idiv ",
  "modOp": " mod ",
  "stringConcatenateOp": "||",
  "eqOp": " eq ",
  "neOp": " ne ",
  "ltOp": " lt ",
  "gtOp": " gt ",
  "leOp": " le ",
  "geOp": " ge ",
  "equalOp": " = ",
  "notEqualOp": " != ",
  "lessThanOp": " < ",
  "greaterThanOp": " > ",
  "lessThanOrEqualOp": " <= ",
  "greaterThanOrEqualOp": " >= ",
  "isOp": " is ",
  "nodeBeforeOp": " << ",
  "nodeAfterOp": " >> ",
  "andOp": " and ",
  "orOp": " or ",
  "unionOp": " union ",
  "intersectOp": " intersect ",
  "exceptOp": " except "
};
Fleur.Serializer._serializeXQXToString = function(node) {
  var i = 0, l, s, n;
  if (node.nodeType === Fleur.Node.DOCUMENT_NODE) {
    return Fleur.Serializer._serializeXQXToString(node.documentElement);
  }
  if (node.namespaceURI !== "http://www.w3.org/2005/XQueryX") {
    return;
  }
  switch(node.localName) {
    case "attributeName":
      return Fleur.Serializer.XQX_renderQName(node);
    case "NCName":
      return node.textContent;
    case "rootExpr":
      return "/";
    case "argumentPlaceholder":
      return "?";
    //case "xqx:pathExpr/xqx:rootExpr":
    case "contextItemExpr":
      return ".";
    case "stringConstantExpr":
    case "stringLiteral":
      l = node.children.length;
      while (i < l) {
        if (node.children[i].localName === "value" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          return Fleur.Serializer.XQX_quote(node.children[i].textContent);
        }
        i++;
      }
      return "";
    case "integerConstantExpr":
    case "integerLiteral":
    case "decimalConstantExpr":
    case "doubleConstantExpr":
      l = node.children.length;
      while (i < l) {
        if (node.children[i].localName === "value" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          return node.children[i].textContent;
        }
        i++;
      }
      return "";
    case "varRef":
    case "variableRef":
      return "$" + Fleur.Serializer.XQX_renderChildren(node, ["name"]);
    case "pragma":
      return "(# " + Fleur.Serializer.XQX_renderChildren(node, ["pragmaName"]) + " " + Fleur.Serializer.XQX_renderChildren(node, ["pragmaContents"]) + " #)";
    case "extensionExpr":
      return Fleur.Serializer.XQX_renderChildren(node, ["pragma"]) + "{" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + "}";
    case "simpleMapExpr":
      l = node.children.length;
      s = "";
      while (i < l) {
        if (node.children[i].localName === "pathExpr" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s += (s === "" ? "( " : "\n! ( ") + Fleur.Serializer._serializeXQXToString(node.children[i]) + " )";
        }
        i++;
      }
      return s;
    case "functionCallExpr":
      l = node.children.length;
      s = "";
      while (i < l) {
        if (node.children[i].localName === "arguments" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s += Fleur.Serializer.XQX_parenthesizedList(node.children[i]) ;
        }
        i++;
      }
      return Fleur.Serializer.XQX_renderChildren(node, ["functionName"]) + (s === "" ? "()" : s);
    case "constructorFunctionExpr":
      l = node.children.length;
      s = "";
      while (i < l) {
        if (node.children[i].localName === "argExpr" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s += Fleur.Serializer.XQX_parenthesizedList(node.children[i]) ;
        }
        i++;
      }
      return Fleur.Serializer.XQX_renderChildren(node, ["typeName"]) + (s === "" ? "()" : s);
    case "unaryMinusOp":
    case "unaryPlusOp":
      return "(" + Fleur.Serializer.XQX_ops[node.localName] + Fleur.Serializer.XQX_renderChildren(node, ["operand"]) + ")";
    case "addOp":
    case "subtractOp":
    case "multiplyOp":
    case "divOp":
    case "idivOp":
    case "modOp":
    case "stringConcatenateOp":
    case "eqOp":
    case "neOp":
    case "ltOp":
    case "gtOp":
    case "leOp":
    case "geOp":
    case "equalOp":
    case "notEqualOp":
    case "lessThanOp":
    case "greaterThanOp":
    case "lessThanOrEqualOp":
    case "greaterThanOrEqualOp":
    case "isOp":
    case "nodeBeforeOp":
    case "nodeAfterOp":
    case "andOp":
    case "orOp":
    case "unionOp":
    case "intersectOp":
    case "exceptOp":
      return "(" + Fleur.Serializer.XQX_renderChildren(node, ["firstOperand"]) + Fleur.Serializer.XQX_ops[node.localName] + Fleur.Serializer.XQX_renderChildren(node, ["secondOperand"]) + ")";
    case "sequenceExpr":
      return Fleur.Serializer.XQX_parenthesizedList(node, ",\n");
    case "firstOperand":
    case "secondOperand":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "rangeSequenceExpr":
      return "(" + Fleur.Serializer.XQX_renderChildren(node, ["startExpr"]) + " to " + Fleur.Serializer.XQX_renderChildren(node, ["endExpr"]) + ")";
    case "forClause":
      return " for " + Fleur.Serializer.XQX_commaSeparatedList(node) + "\n";
    case "forClauseItem":
    case "letClauseItem":
      s = "";
      l = node.children.length;
      while (i < l) {
        s += Fleur.Serializer._serializeXQXToString(node.children[i]);
        i++;
      }
      return s;
    case "allowingEmpty":
      return " allowing empty ";
    case "forExpr":
      return "\n    in " + Fleur.Serializer.XQX_renderChildren(node);
    case "letClause":
      return " let " + Fleur.Serializer.XQX_commaSeparatedList(node) + "\n";
    case "letExpr":
      return " := " + Fleur.Serializer.XQX_renderChildren(node);
    case "windowClause":
      return " for " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
    case "tumblingWindowClause":
      return "   tumbling window " + Fleur.Serializer.XQX_renderChildren(node, ["typedVariableBinding"]) +
        " in " + Fleur.Serializer.XQX_renderChildren(node, ["bindingSequence"]) + "\n" +
        "      " + Fleur.Serializer.XQX_renderChildren(node, ["windowStartCondition"]) + "\n" +
        "      " + Fleur.Serializer.XQX_renderChildren(node, ["windowEndCondition"]);
    case "slidingWindowClause":
      return "   sliding window " + Fleur.Serializer.XQX_renderChildren(node, ["typedVariableBinding"]) +
        " in " + Fleur.Serializer.XQX_renderChildren(node, ["bindingSequence"]) + "\n" +
        "      " + Fleur.Serializer.XQX_renderChildren(node, ["windowStartCondition"]) + "\n" +
        "      " + Fleur.Serializer.XQX_renderChildren(node, ["windowEndCondition"]);
    case "bindingSequence":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "windowStartCondition":
      return "start " + Fleur.Serializer.XQX_renderChildren(node, ["windowVars"]) +
        " when " + Fleur.Serializer.XQX_renderChildren(node, ["winStartExpr"]);
    case "windowEndCondition":
      return (node.getAttributeNS("http://www.w3.org/2005/XQueryX", "onlyEnd") === "true" ? "only end " : "end " ) +
        Fleur.Serializer.XQX_renderChildren(node, ["windowVars"]) + " when " + Fleur.Serializer.XQX_renderChildren(node, ["winEndExpr"]);
    case "windowVars":
      return Fleur.Serializer.XQX_renderChildren(node, ["currentItem"]) + Fleur.Serializer.XQX_renderChildren(node, ["positionalVariableBinding"]) +
        Fleur.Serializer.XQX_renderChildren(node, ["previousItem"]) + Fleur.Serializer.XQX_renderChildren(node, ["nextItem"]);
    case "currentItem":
      return "$" + Fleur.Serializer.XQX_renderEQName(node);
    case "previousItem":
      return " previous $" + Fleur.Serializer.XQX_renderEQName(node);
    case "nextItem":
      return " next $" + Fleur.Serializer.XQX_renderEQName(node);
    case "countClause":
      return " count " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
    case "whereClause":
      return " where " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
    case "groupByClause":
      return "  group by " + Fleur.Serializer.XQX_commaSeparatedList(node) + "\n";
    case "groupingSpec":
      return "$" + Fleur.Serializer.XQX_renderChildren(node);
    case "groupVarInitialize":
/*
    <xsl:if test="xqx:typeDeclaration">
      <xsl:apply-templates select="xqx:typeDeclaration"/>
    </xsl:if>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$ASSIGN"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:apply-templates select="xqx:varValue"/>
  </xsl:template>
*/
    case "collation":
      return " collation " + Fleur.Serializer.XQX_quote(node.textContent);
    case "emptyOrderingMode":
    case "orderingKind":
      return " " + node.textContent;
    case "orderModifier":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "orderBySpec":
      return Fleur.Serializer.XQX_renderChildren(node, ["orderByExpr"]) + " " + Fleur.Serializer.XQX_renderChildren(node, ["orderModifier"]);
     case "orderByClause":
/*
    <xsl:if test="xqx:stable">
      <xsl:text> stable</xsl:text>
    </xsl:if>
    <xsl:text> order by </xsl:text>
    <xsl:apply-templates select="xqx:orderBySpec[1]"/>
    <xsl:for-each select="xqx:orderBySpec[position() > 1]">
      <xsl:value-of select="$COMMA_SPACE"/>
      <xsl:apply-templates select="."/>
    </xsl:for-each>
    <xsl:value-of select="$NEWLINE"/>
  </xsl:template>
  */
    case "returnClause":
      return " return " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
    case "flworExpr":
      return "\n(" + Fleur.Serializer.XQX_renderChildren(node) + ")";
    case "ifThenElseExpr":
      return "( if (" + Fleur.Serializer.XQX_renderChildren(node, ["ifClause"]) + ") then " + Fleur.Serializer.XQX_renderChildren(node, ["thenClause"]) + " else " + Fleur.Serializer.XQX_renderChildren(node, ["elseClause"]) + ")";
    case "positionalVariableBinding":
      return " at $" + Fleur.Serializer.XQX_renderEQName(node);
    case "variableBinding":
      return "$" + Fleur.Serializer.XQX_renderEQName(node) + (node.parentNode.localName === "typeswitchExprCaseClause" && node.parentNode.namespaceURI === "http://www.w3.org/2005/XQueryX" ? " as " : "");
    case "typedVariableBinding": /* name="typedVariableBinding" */
      return "$" + Fleur.Serializer.XQX_renderChildren(node, ["varName"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]);
    case "quantifiedExprInClause":
      return Fleur.Serializer.XQX_renderChildren(node, ["typedVariableBinding"]) + " in " + Fleur.Serializer.XQX_renderChildren(node, ["sourceExpr"]);
    case "quantifiedExpr":
  /*
    <xsl:value-of select="$LPAREN"/>
    <xsl:value-of select="xqx:quantifier"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:apply-templates select="xqx:quantifiedExprInClause[1]"/>
    <xsl:for-each select="xqx:quantifiedExprInClause[position() > 1]">
      <xsl:value-of select="$COMMA_SPACE"/>
      <xsl:apply-templates select="."/>
    </xsl:for-each>
    <xsl:text> satisfies </xsl:text>
    <xsl:apply-templates select="xqx:predicateExpr"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
  */
    case "instanceOfExpr":
      return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " instance of " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ")";
    case "castExpr":
      return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " cast as " + Fleur.Serializer.XQX_renderChildren(node, ["singleType"]) + ")";
    case "castableExpr":
      return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " castable as " + Fleur.Serializer.XQX_renderChildren(node, ["singleType"]) + ")";
    case "treatExpr":
      return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " treat as " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ")";
    case "switchExprCaseClause":
/*
    <xsl:for-each select="xqx:switchCaseExpr">
      <xsl:value-of select="$NEWLINE"/>
      <xsl:text>   case (</xsl:text>
      <xsl:apply-templates select="."/>
      <xsl:text>) </xsl:text>
    </xsl:for-each>
    <xsl:value-of select="$NEWLINE"/>
    <xsl:text>     return </xsl:text>
    <xsl:apply-templates select="xqx:resultExpr"/>
  </xsl:template>
  */
    case "switchExprDefaultClause":
      return "\n   default return " + Fleur.Serializer.XQX_renderChildren(node, ["resultExpr"]);
    case "switchExpr":
      return "(switch(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + ")" +
        Fleur.Serializer.XQX_renderChildren(node, ["switchExprCaseClause"]) + Fleur.Serializer.XQX_renderChildren(node, ["switchExprDefaultClause"]) + ")";
    case "typeswitchExprCaseClause":
      return " case " + Fleur.Serializer.XQX_renderChildren(node, ["variableBinding"]) +
        Fleur.Serializer.XQX_renderChildren(node, ["sequenceType", "sequenceTypeUnion"]) + " return " +
        Fleur.Serializer.XQX_renderChildren(node, ["resultExpr"]);
    case "typeswitchExprDefaultClause":
      return " default " + Fleur.Serializer.XQX_renderChildren(node, ["variableBinding"]) + " return " + Fleur.Serializer.XQX_renderChildren(node, ["resultExpr"]);
    case "typeswitchExpr":
      return "(typeswitch(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + ")" +
        Fleur.Serializer.XQX_renderChildren(node, ["typeswitchExprCaseClause"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeswitchExprDefaultClause"]) +
        ")";
    case "tryCatchExpr":
      return "\n(try " + Fleur.Serializer.XQX_renderChildren(node, ["tryClause"]) + Fleur.Serializer.XQX_renderChildren(node, ["catchClause"]) + ")";
    case "tryClause":
      return "{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
    case "catchClause":
      return "\n  catch " + Fleur.Serializer.XQX_renderChildren(node, ["catchErrorList"]) + Fleur.Serializer.XQX_renderChildren(node, ["catchExpr"]);
    case "catchErrorList":
/*
    <xsl:for-each select="xqx:nameTest | xqx:Wildcard">
      <xsl:if test="(position() mod 5) = 0">
        <xsl:value-of select="$NEWLINE"/>
        <xsl:text>      </xsl:text>
      </xsl:if>
      <xsl:if test="position() > 1">
        <xsl:text>| </xsl:text>
      </xsl:if>
      <xsl:apply-templates select="."/>
      <xsl:value-of select="$SPACE"/>
    </xsl:for-each>
  </xsl:template>
  */
    case "catchExpr":
      return "\n{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
    case "validateExpr":
/*
    <xsl:value-of select="$LPAREN"/>
    <xsl:text> validate </xsl:text>
    <xsl:if test="xqx:validationMode">
      <xsl:value-of select="xqx:validationMode"/>
      <xsl:value-of select="$SPACE"/>
    </xsl:if>
    <xsl:if test="xqx:typeName">
      <xsl:text>type </xsl:text>
      <xsl:apply-templates select="xqx:typeName"/>
      <xsl:value-of select="$SPACE"/>
    </xsl:if>
    <xsl:value-of select="$LBRACE"/>
    <xsl:apply-templates select="xqx:argExpr"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$RBRACE"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
  */
    case "xpathAxis":
      return node.textContent + "::";
    case "predicates":
      s = "";
      l = node.children.length;
      while (i < l) {
        s += "[" + Fleur.Serializer._serializeXQXToString(node.children[i]) + "]";
        i++;
      }
      return s;
    case "predicate":
      return "[" + Fleur.Serializer.XQX_renderChildren(node) + "]";
    case "dynamicFunctionInvocationExpr":
/*
    <xsl:apply-templates select="xqx:functionItem"/>
    <xsl:apply-templates select="xqx:predicates"/>
    <xsl:choose>
      <xsl:when test="xqx:arguments">
        <xsl:for-each select="xqx:arguments">
          <xsl:call-template name="parenthesizedList"/>
        </xsl:for-each>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$LPAREN"/>
        <xsl:value-of select="$RPAREN"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  */
    case "functionItem":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "mapConstructor":
/*
     <xsl:text>map { </xsl:text>
     <xsl:apply-templates select="xqx:mapConstructorEntry[1]"/>
     <xsl:if test="xqx:mapConstructorEntry[2]">
       <xsl:for-each select="xqx:mapConstructorEntry[position() > 1]">
         <xsl:text> , </xsl:text>
         <xsl:apply-templates select="."/>
       </xsl:for-each>
     </xsl:if>
     <xsl:text> } </xsl:text>
  </xsl:template>
  */
    case "mapConstructorEntry":
  /*
    <xsl:apply-templates select="*[1]"/>
    <xsl:text> : </xsl:text>
    <xsl:apply-templates select="*[2]"/>
  </xsl:template>
  */
    case "arrayConstructor":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "squareArray":
/*
    <xsl:text> [ </xsl:text>
    <xsl:apply-templates select="xqx:arrayElem[1]"/>
    <xsl:if test="xqx:arrayElem[2]">
      <xsl:for-each select="xqx:arrayElem[position() > 1]">
        <xsl:text> , </xsl:text>
        <xsl:apply-templates select="."/>
      </xsl:for-each>
    </xsl:if>
    <xsl:text> ] </xsl:text>
  </xsl:template>
  */
    case "curlyArray":
      return " array { " + Fleur.Serializer.XQX_renderChildren(node) + " } ";
    case "star":
      return "*";
      /*
    case "Wildcard[*]":
    <xsl:choose>
      <xsl:when test="local-name(./child::*[1])='star'">
        <xsl:apply-templates select="xqx:star"/>
        <xsl:value-of select="$COLON"/>
        <xsl:apply-templates select="xqx:NCName"/>
      </xsl:when>
      <xsl:when test="local-name(./child::*[1])='NCName'">
        <xsl:apply-templates select="xqx:NCName"/>
        <xsl:value-of select="$COLON"/>
        <xsl:apply-templates select="xqx:star"/>
      </xsl:when>
      <xsl:when test="local-name(./child::*[1])='uri'">
        <xsl:text>Q</xsl:text>
        <xsl:value-of select="$LBRACE"/>
        <xsl:value-of select="./xqx:uri"/>
        <xsl:value-of select="$RBRACE"/>
        <xsl:apply-templates select="xqx:star"/>
      </xsl:when>
    </xsl:choose>
  </xsl:template>
    case "Wildcard[not(*)]":
    <xsl:value-of select="$STAR"/>
  </xsl:template>
  <xsl:template name="simpleWildcard" match="xqx:simpleWildcard">
    <xsl:apply-templates select="xqx:star"/>
    <xsl:apply-templates select="xqx:QName"/>
  </xsl:template>
  */
    case "textTest":
      return "text()";
    case "commentTest":
      return "comment()";
    case "namespaceTest":
      return "namespace-node()";
    case "anyKindTest":
      return "node()";
    case "piTest":
      return "processing-instruction(" + Fleur.Serializer.XQX_renderChildren(node) + ")";
    case "documentTest":
      return "document-node(" + Fleur.Serializer.XQX_renderChildren(node) + ")";
    case "nameTest":
      return Fleur.Serializer.XQX_renderEQName(node);
    case "attributeTest":
/*
    <xsl:text>attribute</xsl:text>
    <xsl:value-of select="$LPAREN"/>
    <xsl:for-each select="xqx:attributeName">
      <xsl:call-template name="simpleWildcard"/>
    </xsl:for-each>
    <xsl:if test="xqx:typeName">
      <xsl:value-of select="$COMMA"/>
      <xsl:apply-templates select="xqx:typeName"/>
    </xsl:if>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
  */
    case "elementTest":
/*
    <xsl:text>element</xsl:text>
    <xsl:value-of select="$LPAREN"/>
    <xsl:for-each select="xqx:elementName">
      <xsl:call-template name="simpleWildcard"/>
    </xsl:for-each>
    <xsl:if test="xqx:typeName">
      <xsl:value-of select="$COMMA"/>
      <xsl:apply-templates select="xqx:typeName"/>
    </xsl:if>
    <xsl:if test="xqx:nillable">
      <xsl:value-of select="$QUESTIONMARK"/>
    </xsl:if>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
  */
    case "schemaElementTest":
      return "schema-element(" + Fleur.Serializer.XQX_renderEQName(node) + ")";
    case "schemaAttributeTest":
      return "schema-attribute(" + Fleur.Serializer.XQX_renderEQName(node) + ")";
    case "anyFunctionTest":
      return Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function(*)";
    case "typedFunctionTest":
      return Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function" + Fleur.Serializer.XQX_renderChildren(node, ["paramTypeList"]) +
        " as " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]);
    case "paramTypeList":
      return Fleur.Serializer.XQX_parenthesizedList(node);
    case "anyMapTest":
      return " map(*)";
    case "typedMapTest":
      return " map(" + Fleur.Serializer.XQX_renderChildren(node, ["atomicType"]) + ", " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ") ";
    case "lookup":
      return " ?" + Fleur.Serializer.XQX_renderChildren(node);
    case "arrowPostfix":
/*
    <xsl:text> => </xsl:text>
    <xsl:apply-templates select="*[not(self::xqx:arguments)]"/>
    <xsl:if test="xqx:arguments">
      <xsl:for-each select="xqx:arguments">
        <xsl:call-template name="parenthesizedList"/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>
  */
    case "anyArrayTest":
      return " array(*)";
    case "typedArrayTest":
      return " array(" + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ") ";
    case "parenthesizedItemType":
      return " ( " + Fleur.Serializer.XQX_renderChildren(node) + " ) ";
    case "stepExpr":
      s = "";
      n = node.previousSibling;
      while (n) {
        if (n.localName === "stepExpr" && n.namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s = "/";
          break;
        }
        n = n.previousSibling;
      }
      return s + Fleur.Serializer.XQX_renderChildren(node);
    case "filterExpr":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "namedFunctionRef":
      return Fleur.Serializer.XQX_renderChildren(node, ["functionName"]) + "#" + Fleur.Serializer.XQX_renderChildren(node, ["integerConstantExpr"]);
    case "inlineFunctionExpr":
      return Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function " + Fleur.Serializer.XQX_renderChildren(node, ["paramList"]) +
        Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]) +   Fleur.Serializer.XQX_renderChildren(node, ["functionBody"]);
    case "pathExpr":
      return Fleur.Serializer.XQX_renderChildren(node, ["rootExpr", "stepExpr"]);
    case "attributeConstructor":
/*
    <xsl:value-of select="$SPACE"/>
    <xsl:apply-templates select="xqx:attributeName"/>
    <xsl:value-of select="$EQUAL"/>
    <xsl:choose>
      <xsl:when test="xqx:attributeValue">
        <xsl:call-template name="globalReplace">
          <xsl:with-param name="stringToBeFixed">
            <xsl:call-template name="globalReplace">
              <xsl:with-param name="stringToBeFixed">
                <xsl:call-template name="quote">
                  <xsl:with-param name="item">
                    <xsl:call-template name="globalReplace">
                      <xsl:with-param name="stringToBeFixed">
                        <xsl:call-template name="globalReplace">
                          <xsl:with-param name="stringToBeFixed">
                            <xsl:value-of select="xqx:attributeValue"/>
                          </xsl:with-param>
                          <xsl:with-param name="toBeReplaced"><xsl:text>{</xsl:text></xsl:with-param>
                          <xsl:with-param name="replacement"><xsl:text>{{</xsl:text></xsl:with-param>
                        </xsl:call-template>
                      </xsl:with-param>
                      <xsl:with-param name="toBeReplaced"><xsl:text>}</xsl:text></xsl:with-param>
                      <xsl:with-param name="replacement"><xsl:text>}}</xsl:text></xsl:with-param>
                    </xsl:call-template>
                  </xsl:with-param>
                </xsl:call-template>
              </xsl:with-param>
              <xsl:with-param name="toBeReplaced" select="'&#xA;'"/>
              <xsl:with-param name="replacement">&amp;#xA;</xsl:with-param>
            </xsl:call-template>
          </xsl:with-param>
          <xsl:with-param name="toBeReplaced" select="'&#x9;'"/>
          <xsl:with-param name="replacement">&amp;#x9;</xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$DOUBLEQUOTE"/>
        <xsl:for-each select="./xqx:attributeValueExpr/xqx:*">
          <xsl:value-of select="$LBRACE"/>
            <xsl:apply-templates select="."/>
          <xsl:value-of select="$RBRACE"/>
        </xsl:for-each>
        <xsl:value-of select="$DOUBLEQUOTE"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  */
    case "namespaceDeclaration":
/*
    <xsl:text> xmlns</xsl:text>
    <xsl:if test="xqx:prefix">
      <xsl:text>:</xsl:text>
      <xsl:value-of select="xqx:prefix"/>
    </xsl:if>
    <xsl:value-of select="$EQUAL"/>
    <xsl:call-template name="quote">
       <xsl:with-param name="item">
         <xsl:call-template name="globalReplace">
           <xsl:with-param name="stringToBeFixed">
             <xsl:call-template name="globalReplace">
               <xsl:with-param name="stringToBeFixed">
                 <xsl:value-of select="xqx:uri"/>
               </xsl:with-param>
               <xsl:with-param name="toBeReplaced">
                 <xsl:text>{</xsl:text>
               </xsl:with-param>
               <xsl:with-param name="replacement">
                 <xsl:text>{{</xsl:text>
               </xsl:with-param>
             </xsl:call-template>
           </xsl:with-param>
           <xsl:with-param name="toBeReplaced">
             <xsl:text>}</xsl:text>
           </xsl:with-param>
           <xsl:with-param name="replacement">
             <xsl:text>}}</xsl:text>
           </xsl:with-param>
         </xsl:call-template>
       </xsl:with-param>
    </xsl:call-template>
  </xsl:template>
  */
    case "attributeList":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "elementContent":
      l = node.children.length;
      s = "";
      while (i < l) {
        if (node.children[i].localName !== "elementConstructor" || node.children[i].namespaceURI !== "http://www.w3.org/2005/XQueryX") {
          s += " {" + Fleur.Serializer._serializeXQXToString(node.children[i]) + " }";
        } else {
          s += Fleur.Serializer._serializeXQXToString(node.children[i]);
        }
        i++;
      }
      return s;
    case "elementConstructor":
      return "<" + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + Fleur.Serializer.XQX_renderChildren(node, ["xqx:attributeList"]) +
        ">" + Fleur.Serializer.XQX_renderChildren(node, ["elementContent"]) + "</" + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + ">";
    case "tagNameExpr":
      return "{" + Fleur.Serializer.XQX_renderChildren(node) + "}";
    case "computedElementConstructor":
      return " element " + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + Fleur.Serializer.XQX_renderChildren(node, ["tagNameExpr"]) +
        " { " + Fleur.Serializer.XQX_renderChildren(node, ["contentExpr"]) + " }";
    case "contentExpr":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "computedAttributeConstructor":
      return " attribute " + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + Fleur.Serializer.XQX_renderChildren(node, ["tagNameExpr"]) +
        " { " + Fleur.Serializer.XQX_renderChildren(node, ["valueExpr"]) + " }";
    case "computedDocumentConstructor":
      return " document {" + Fleur.Serializer.XQX_renderChildren(node) + " }";
    case "computedTextConstructor":
      return " text {" + Fleur.Serializer.XQX_renderChildren(node) + " }";
    case "computedCommentConstructor":
      return " comment {" + Fleur.Serializer.XQX_renderChildren(node) + " }";
    case "computedNamespaceConstructor":
/*
    <xsl:text> namespace </xsl:text>
    <xsl:choose>
      <xsl:when test="xqx:prefix">
        <xsl:value-of select="xqx:prefix"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$LBRACE"/>
        <xsl:apply-templates select="xqx:prefixExpr"/>
        <xsl:value-of select="$RBRACE"/>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$LBRACE"/>
    <xsl:apply-templates select="xqx:URIExpr"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
  */
    case "piTargetExpr":
      return "{" + Fleur.Serializer.XQX_renderChildren(node) + "}";
    case "piValueExpr":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "computedPIConstructor":
/*
    <xsl:text> processing-instruction </xsl:text>
    <xsl:value-of select="xqx:piTarget"/>
    <xsl:apply-templates select="xqx:piTargetExpr"/>
    <xsl:value-of select="$LBRACE"/>
    <xsl:apply-templates select="xqx:piValueExpr"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
  */
    case "unorderedExpr":
      return " unordered{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
    case "orderedExpr":
      return " ordered{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
    case "versionDecl":
/*
    <xsl:text>xquery </xsl:text>
    <xsl:if test="xqx:version">
      <xsl:text>version </xsl:text>
      <xsl:call-template name="quote">
        <xsl:with-param name="item" select="xqx:version"/>
      </xsl:call-template>
    </xsl:if>
    <xsl:if test="xqx:encoding and xqx:version">
      <xsl:value-of select="$SPACE"/>
    </xsl:if>
    <xsl:if test="xqx:encoding">
      <xsl:text>encoding </xsl:text>
      <xsl:call-template name="quote">
        <xsl:with-param name="item" select="xqx:encoding"/>
      </xsl:call-template>
    </xsl:if>
    <xsl:value-of select="$SEPARATOR"/>
    <xsl:value-of select="$NEWLINE"/>
  </xsl:template>
  */
    case "namespaceDecl":
       s = "declare namespace ";
      l = node.children.length;
      while (i < l) {
        if (node.children[i].localName === "prefix" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s += node.children[i].textContent;
          break;
        }
        i++;
      }
      s += "=";
      i = 0;
      while (i < l) {
        if (node.children[i].localName === "uri" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          return s + Fleur.Serializer.XQX_quote(node.children[i].textContent);
        }
        i++;
      }
      return s;
    case "defaultNamespaceDecl":
      s = "declare default ";
      l = node.children.length;
      while (i < l) {
        if (node.children[i].localName === "defaultNamespaceCategory" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s += node.children[i].textContent;
          break;
        }
        i++;
      }
      s += " namespace ";
      i = 0;
      while (i < l) {
        if (node.children[i].localName === "uri" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          return s + Fleur.Serializer.XQX_quote(node.children[i].textContent);
        }
        i++;
      }
      return s;
    case "boundarySpaceDecl":
      return "declare boundary-space " + node.textContent;
    case "defaultCollationDecl":
      return "declare default collation " + Fleur.Serializer.XQX_quote(node.textContent);
    case "baseUriDecl":
      return "declare base-uri " + Fleur.Serializer.XQX_quote(node.textContent);
    case "constructionDecl":
      return "declare construction " + node.textContent;
    case "orderingModeDecl":
      return "declare ordering " + node.textContent;
    case "emptyOrderingDecl":
      return "declare default order " + node.textContent;
    case "copyNamespacesDecl":
/*
    <xsl:text>declare copy-namespaces </xsl:text>
    <xsl:value-of select="xqx:preserveMode"/>
    <xsl:value-of select="$COMMA"/>
    <xsl:value-of select="xqx:inheritMode"/>
  </xsl:template>
  */
    case "optionDecl":
      s = "declare option " + Fleur.Serializer.XQX_renderChildren(node, ["optionName"]) + " ";
      l = node.children.length;
      while (i < l) {
        if (node.children[i].localName === "optionContents" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s += Fleur.Serializer.XQX_quote(node.children[i].textContent);
          break;
        }
        i++;
      }
      return s;
    case "decimalFormatDecl":
/*
    <xsl:text>declare </xsl:text>
    <xsl:if test="not(xqx:decimalFormatName)">
      <xsl:text>default </xsl:text>
    </xsl:if>
    <xsl:text>decimal-format </xsl:text>
    <xsl:if test="xqx:decimalFormatName">
      <xsl:apply-templates select="xqx:decimalFormatName"/>
      <xsl:text> </xsl:text>
    </xsl:if>
    <xsl:apply-templates select="xqx:decimalFormatParam"/>
  </xsl:template>
  */
    case "decimalFormatParam":
      s = Fleur.Serializer.XQX_renderChildren(node, ["decimalFormatParamName"]) + " = ";
      l = node.children.length;
      while (i < l) {
        if (node.children[i].localName === "decimalFormatParamValue" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s += Fleur.Serializer.XQX_quote(node.children[i].textContent);
          break;
        }
        i++;
      }
      return s + " ";
    case "voidSequenceType":
      return "empty-sequence()";
    case "occurrenceIndicator":
      return node.textContent;
    case "anyItemType":
      return "item()";
    case "sequenceType":
      return Fleur.Serializer.XQX_renderChildren(node);
    case "sequenceTypeUnion":
/*
    <xsl:apply-templates select="xqx:sequenceType[1]"/>
    <xsl:if test="count(xqx:sequenceType) > 1">
      <xsl:for-each select="xqx:sequenceType[position() > 1]">
        <xsl:text> | </xsl:text>
        <xsl:apply-templates select="."/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>
*/
    case "singleType":
/*
    <xsl:apply-templates select="xqx:atomicType"/>
    <xsl:if test="xqx:optional">
      <xsl:text>?</xsl:text>
    </xsl:if>
  </xsl:template>
  */
    case "typeDeclaration":
    case "contextItemType":
      return " as " + Fleur.Serializer.XQX_renderChildren(node);
    case "contextItemDecl":
/*
    <xsl:text>declare context item </xsl:text>
    <xsl:apply-templates select="xqx:contextItemType"/>
    <xsl:if test="xqx:varValue">
      <xsl:value-of select="$SPACE"/>
      <xsl:value-of select="$ASSIGN"/>
      <xsl:value-of select="$SPACE"/>
      <xsl:apply-templates select="xqx:varValue"/>
    </xsl:if>
    <xsl:if test="xqx:external">
      <xsl:text> external </xsl:text>
      <xsl:if test="xqx:external/xqx:varValue">
        <xsl:text>:= </xsl:text>
        <xsl:apply-templates select="xqx:external/xqx:varValue"/>
      </xsl:if>
    </xsl:if>
  </xsl:template>
  */
    case "annotation":
/*
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$PERCENT"/>
    <xsl:apply-templates select="xqx:annotationName"/>
    <xsl:if test="xqx:arguments">
      <xsl:for-each select="xqx:arguments">
         <xsl:call-template name="parenthesizedList"/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>
  */
    case "varDecl":
/*
    <xsl:text>declare</xsl:text>
    <xsl:apply-templates select="xqx:annotation"/>
    <xsl:text> variable </xsl:text>
    <xsl:value-of select="$DOLLAR"/>
    <xsl:apply-templates select="xqx:varName"/>
    <xsl:apply-templates select="xqx:typeDeclaration"/>
    <xsl:if test="xqx:varValue">
      <xsl:value-of select="$ASSIGN"/>
      <xsl:apply-templates select="xqx:varValue"/>
    </xsl:if>
    <xsl:if test="xqx:external">
      <xsl:text> external </xsl:text>
      <xsl:if test="xqx:external/xqx:varValue">
        <xsl:text>:= </xsl:text>
        <xsl:apply-templates select="xqx:external/xqx:varValue"/>
      </xsl:if>
    </xsl:if>
  </xsl:template>
  */
    case "targetLocation":
/*
    <xsl:choose>
      <xsl:when test="position()=1"> at </xsl:when>
      <xsl:otherwise>,&#xD;  </xsl:otherwise>
    </xsl:choose>
    <xsl:call-template name="quote">
      <xsl:with-param name="item" select="."/>
    </xsl:call-template>
  </xsl:template>
  */
    case "schemaImport":
/*
    <xsl:text> import schema </xsl:text>
    <xsl:if test="xqx:defaultElementNamespace">
      <xsl:text> default element namespace </xsl:text>
    </xsl:if>
    <xsl:if test="xqx:namespacePrefix">
      <xsl:text> namespace </xsl:text>
      <xsl:value-of select="xqx:namespacePrefix"/>
      <xsl:value-of select="$EQUAL"/>
    </xsl:if>
    <xsl:call-template name="quote">
      <xsl:with-param name="item" select="xqx:targetNamespace"/>
    </xsl:call-template>
    <xsl:apply-templates select="xqx:targetLocation"/>
  </xsl:template>
  */
    case "moduleImport":
/*
    <xsl:text> import module </xsl:text>
    <xsl:if test="xqx:namespacePrefix">
      <xsl:text> namespace </xsl:text>
      <xsl:value-of select="xqx:namespacePrefix"/>
      <xsl:value-of select="$EQUAL"/>
    </xsl:if>
    <xsl:call-template name="quote">
      <xsl:with-param name="item" select="xqx:targetNamespace"/>
    </xsl:call-template>
    <xsl:apply-templates select="xqx:targetLocation"/>
  </xsl:template>
  */
    case "javascriptImport":
    case "param":
      return "$" + Fleur.Serializer.XQX_renderChildren(node, ["varName"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]);
    case "paramList":
      return Fleur.Serializer.XQX_parenthesizedList(node);
    case "functionBody":
      return "\n{\n" + Fleur.Serializer.XQX_renderChildren(node) + "\n}";
    case "functionDecl":
      s = "declare" + Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function " + Fleur.Serializer.XQX_renderChildren(node, ["functionName"]) + Fleur.Serializer.XQX_renderChildren(node, ["paramList"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]);
      l = node.children.length;
      while (i < l) {
        if (node.children[i].localName === "externalDefinition" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          return s + " external ";
        }
        i++;
      }
      return s + Fleur.Serializer.XQX_renderChildren(node, ["functionBody"]);
    case "queryBody":
      return Fleur.Serializer.XQX_renderChildren(node) + "\n";
    case "moduleDecl":
      s = " module namespace ";
      l = node.children.length;
      while (i < l) {
        if (node.children[i].localName === "prefix" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s += node.children[i].textContent;
          break;
        }
        i++;
      }
      s += "=";
      i = 0;
      l = node.children.length;
      while (i < l) {
        if (node.children[i].localName === "uri" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
          s += Fleur.Serializer.XQX_quote(node.children[i].textContent);
          break;
        }
        i++;
      }
      return s + ";\n";
    case "prolog":
      s = "";
      l = node.children.length;
      while (i < l) {
        s += Fleur.Serializer._serializeXQXToString(node.children[i]) + ";\n";
        i++;
      }
      return s + ";\n";
    case "libraryModule":
      return Fleur.Serializer.XQX_renderChildren(node, ["moduleDecl"]) + Fleur.Serializer.XQX_renderChildren(node, ["prolog"]);
    case "mainModule":
      return Fleur.Serializer.XQX_renderChildren(node, ["prolog"]) + Fleur.Serializer.XQX_renderChildren(node, ["queryBody"]);
    case "module":
      return Fleur.Serializer.XQX_renderChildren(node);
  }
};
Fleur.Serializer.xhtml2html5 = function(s, jspath, csspath, fleurpath) {
  var ii, ll, text, index, offset = 0, end = s.length,
    nodename, attrs, parents = [], c,
    seps_pi = " \t\n\r?", seps_dtd = " \t\n\r[>", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r",
    n, newnamespaces = {}, pindex, prefix, dtdtype, dtdpublicid, dtdsystemid, entityvalue, notationvalue, uri;
  var r0 = "", r = "", rmodel = "", rsave = "", roptions = "";
  var xformsinside = false;
  var xmlser = false;
  var lt = "<";
  var gt = ">";
  var amp = "&";
  var xsltformscssfile = "<link type=\"text/css\" href=\"" + csspath + "\" rel=\"stylesheet\">";
  var fleurjsfile = (fleurpath ? "<script type=\"text/javascript\" src=\"" + fleurpath + "\" data-uri=\"http://www.agencexml.com/fleur\">/* */</script>" : "");
  var xsltformsjsfile = "<script type=\"text/javascript\" src=\"" + jspath + "\" data-uri=\"http://www.agencexml.com/xsltforms\">/* */</script>";
  var emptyelts = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
  var tableelts = ["table", "thead", "tbody", "tfoot"];
  var tableeltpos;
  var tablerepeat;
  var xlinkattrs = ["actuate", "arcrole", "href", "role", "show", "title", "type"];
  var xmlattrs = ["base", "lang", "space"];
  var xmlnsattrs = ["xlink"];
  var htmluri = "http://www.w3.org/1999/xhtml";
  var mathmluri = "http://www.w3.org/1998/Math/MathML";
  var svguri = "http://www.w3.org/2000/svg";
  var xlinkuri = "http://www.w3.org/1999/xlink";
  var xmluri = "http://www.w3.org/XML/1998/namespace";
  var xmlnsuri = "http://www.w3.org/2000/xmlns/";
  var xformsuri = "http://www.w3.org/2002/xforms";
  var eventuri = "http://www.w3.org/2001/xml-events";
  var xsuri = "http://www.w3.org/2001/XMLSchema";
  var avt;
  var nsi;
  var namespaces = [
    { prefix: "xml", namespaceURI: xmluri, htmlimplicit: true, xmlimplicit: true },
    { prefix: "xmlns", namespaceURI: xmlnsuri, htmlimplicit: true, xmlimplicit: true },
    { prefix: "", namespaceURI: htmluri, htmlimplicit: true, xmlimplicit: false },
    { prefix: "xlink", namespaceURI: xlinkuri, htmlimplicit: false, xmlimplicit: false }
  ];
  var nsLookupFirstpos = 0;
  var nsLookupLastpos = 3;
  var attr;
  var nsattr;
  let indentlevel = 0;
  let okindent = true;
  while (offset !== end) {
    text = "";
    c = s.charAt(offset);
    while (c !== "<" && offset !== end) {
      if (c === ">") {
        text += gt;
      } else if (c === "&") {
        text += amp;
      } else if (r !== "" || r0 !== "" || (c !== "\r" && c !== "\n" && c !== "\t" && c !== " ")) {
        text += c;
      }
      c = s.charAt(++offset);
    }
    if (text.trim() !== "") {
      r += text;
    }
    if (offset === end) {
      break;
    }
    offset++;
    if (s.charAt(offset) === "!") {
      offset++;
      if (s.substr(offset, 2) === "--") {
        offset += 2;
        index = s.indexOf("-->", offset);
        if (index !== offset) {
          if (index === -1) {
            index = end;
          }
          text = "";
          ii = offset;
          while (ii < index) {
            text += s.charAt(ii++);
          }
          text = text.replace(/\x01/gm, lt);
          r += lt + "!--" + text + "--" + gt;
          if (index === end) {
            break;
          }
          offset = index;
        }
        offset += 3;
      } else if (s.substr(offset, 7) === "[CDATA[") {
        offset += 7;
        index = s.indexOf("]]>", offset);
        if (index !== offset) {
          if (index === -1) {
            index = end;
          }
          text = "";
          ii = offset;
          while (ii < index) {
            text += s.charAt(ii++);
          }
          text = text.replace(/\x01/gm,"<");
          r += lt + "[CDATA[" + text + "]]" + gt;
          if (index === end) {
            break;
          }
          offset = index;
        }
        offset += 3;
      } else if (s.substr(offset, 7) === "DOCTYPE") {
        offset += 7;
        index = s.indexOf(">", offset);
        while (seps.indexOf(c) !== -1) {
          c = s.charAt(offset++);
        }
        nodename = "";
        while (seps_dtd.indexOf(c) === -1) {
          nodename += c;
          c = s.charAt(offset++);
        }
        while (seps.indexOf(c) !== -1) {
          c = s.charAt(offset++);
        }
        dtdtype = "";
        while (seps_dtd.indexOf(c) === -1) {
          dtdtype += c;
          c = s.charAt(offset++);
        }
        if (dtdtype === "PUBLIC" || dtdtype === "SYSTEM") {
          if (dtdtype === "PUBLIC") {
            while (seps.indexOf(c) !== -1) {
              c = s.charAt(offset++);
            }
            dtdpublicid = "";
            ii = offset;
            ll = Math.min(index - 1, s.indexOf(c, offset));
            while (ii < ll) {
              dtdpublicid += s.charAt(ii++);
            }
            offset += dtdpublicid.length + 1;
            c = s.charAt(offset++);
          }
          while (seps.indexOf(c) !== -1) {
            c = s.charAt(offset++);
          }
          dtdsystemid = "";
          ii = offset;
          ll = Math.min(index - 1, s.indexOf(c, offset));
          while (ii < ll) {
            dtdsystemid += s.charAt(ii++);
          }
          offset += dtdsystemid.length + 1;
          c = s.charAt(offset++);
          while (seps.indexOf(c) !== -1) {
            c = s.charAt(offset++);
          }
        } else {
          dtdpublicid = dtdsystemid = null;
        }
        if (c === "[") {
          index = s.indexOf("]", offset);
          c = s.charAt(offset++);
          while (c !== "]" && offset < end) {
            while (seps.indexOf(c) !== -1) {
              c = s.charAt(offset++);
            }
            if (c === "]") {
              break;
            }
            if (s.substr(offset, 7) === "!ENTITY") {
              offset += 7;
              c = s.charAt(offset++);
              while (seps.indexOf(c) !== -1) {
                c = s.charAt(offset++);
              }
              if (c === "%") {
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              }
              nodename = "";
              while (seps_dtd.indexOf(c) === -1) {
                nodename += c;
                c = s.charAt(offset++);
              }
              while (seps.indexOf(c) !== -1) {
                c = s.charAt(offset++);
              }
              if (s.substr(offset - 1, 6) === "SYSTEM") {
                offset += 5;
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              } else if (s.substr(offset -1, 6) === "PUBLIC") {
                offset += 5;
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
                while (seps_dtd.indexOf(c) === -1) {
                  c = s.charAt(offset++);
                }
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              }
              entityvalue = "";
              ii = offset;
              ll = Math.min(index - 1, s.indexOf(c, offset));
              while (ii < ll) {
                entityvalue += s.charAt(ii++);
              }
              offset += entityvalue.length + 1;
              c = s.charAt(offset++);
            } else if (s.substr(offset, 9) === "!NOTATION") {
              offset += 9;
              c = s.charAt(offset++);
              while (seps.indexOf(c) !== -1) {
                c = s.charAt(offset++);
              }
              nodename = "";
              while (seps_dtd.indexOf(c) === -1) {
                nodename += c;
                c = s.charAt(offset++);
              }
              while (seps.indexOf(c) !== -1) {
                c = s.charAt(offset++);
              }
              if (s.substr(offset - 1, 6) === "SYSTEM") {
                offset += 5;
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              } else if (s.substr(offset -1, 6) === "PUBLIC") {
                offset += 5;
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
                while (seps_dtd.indexOf(c) === -1) {
                  c = s.charAt(offset++);
                }
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              }
              if (c === '"' || c === "'") {
                notationvalue = "";
                ii = offset;
                ll = Math.min(index - 1, s.indexOf(c, offset));
                while (ii < ll) {
                  notationvalue += s.charAt(ii++);
                }
                offset += notationvalue.length + 1;
                c = s.charAt(offset++);
              }
            }
            offset = s.indexOf(">", offset - 1) + 1;
            c = s.charAt(offset++);
          }
          index = s.indexOf(">", offset);
        }
        if (index !== offset) {
          if (index === -1) {
            index = end;
          }
          if (index === end) {
            break;
          }
          offset = index;
        }
        offset++;
      }
    } else if (s.charAt(offset) === "?") {
      offset++;
      c = s.charAt(offset++);
      nodename = "";
      while (seps_pi.indexOf(c) === -1) {
        nodename += c;
        c = s.charAt(offset++);
      }
      index = s.indexOf("?>", offset - 1);
      if (index === -1) {
        index = end;
      }
      if (nodename === "xml") {
        if (s.charCodeAt(index + 2) === 13) {
          index++;
        }
        if (s.charCodeAt(index + 2) === 10) {
          index++;
        }
      } else if (nodename !== "") {
        text = "";
        ii = offset;
        while (ii < index) {
          text += s.charAt(ii++);
        }
        text = text.replace(/\x01/gm,"<");
        if (nodename === "xsltforms-options") {
          roptions += " " + text;
        } else if (nodename !== "xml-stylesheet") {
          r += lt + "?" + nodename + " " + (index === offset - 1 ? "" : text) + "?" + gt;
        }
      }
      if (index === end) {
        break;
      }
      offset = index + 2;
    } else if (s.charAt(offset) === "/") {
      offset++;
      c = s.charAt(offset++);
      nodename = "";
      while (seps_close.indexOf(c) === -1 && offset <= end) {
        nodename += c;
        c = s.charAt(offset++);
      }
      n = parents.pop();
      nsLookupFirstpos = n.nsLookupFirstpos;
      nsLookupLastpos = n.nsLookupLastpos;
      if (nodename !== n.nodeName) {
        return "Malformed XHTML";
      }
      if (n.localName === "instance" && n.namespaceURI === xformsuri) {
        r += "</script>\n";
        indentlevel--;
        xmlser = false;
        lt = "<";
        gt = ">";
        amp = "&";
        nsLookupFirstpos = 0;
      //} else if (n.localName === "head" && n.namespaceURI === htmluri) {
      //  r += xsltformsjsfile;
      }
      //console.log(uri + " " + nodelocalname + ": " + parents.reduce(function(ret, p) { return ret + " " + p.nodelocalname; }, ""));
      if (n.namespaceURI !== xformsuri || n.localName !== "repeat" || parents[parents.length - 1].namespaceURI !== htmluri ||!tableelts.includes(parents[parents.length - 1].localName)) {
        indentlevel--;
        r += (okindent ? "  ".repeat(Math.max(indentlevel,0)) : "") + lt + "/" + (xmlser ? n.nodeName : (n.namespaceURI === xformsuri ? "xforms-" : "") + n.localName) + gt + "\n";
        okindent = true;
        if (xmlser && n.namespaceURI === xsuri && n.localName === "schema") {
          r += "</script>\n";
          xmlser = false;
          lt = "<";
          gt = ">";
          amp = "&";
          nsLookupFirstpos = 0;
        }
        if (n.localName === "model" && n.namespaceURI === xformsuri) {
          rmodel = r;
          r = rsave;
        }
      }
      offset = s.indexOf(">", offset - 1) + 1;
      if (offset === 0) {
        break;
      }
    } else {
      c = s.charAt(offset++);
      n = {};
      n.nsLookupFirstpos = nsLookupFirstpos;
      n.nsLookupLastpos = nsLookupLastpos;
      n.nodeName = "";
      while (seps_elt.indexOf(c) === -1 && offset <= end) {
        n.nodeName += c;
        c = s.charAt(offset++);
      }
      index = s.indexOf(">", offset - 1);
      if (n.nodeName !== "") {
        attrs = [];
        attr = {};
        while (offset <= end) {
          while (seps.indexOf(c) !== -1) {
            c = s.charAt(offset++);
          }
          if (c === "/" || c === ">" || offset === end) {
            break;
          }
          attr.nodeName = "";
          while (seps_attr.indexOf(c) === -1 && offset <= end) {
            attr.nodeName += c;
            c = s.charAt(offset++);
          }
          while (seps.indexOf(c) !== -1 && offset <= end) {
            c = s.charAt(offset++);
          }
          if (c === "=") {
            c = s.charAt(offset++);
            while (seps.indexOf(c) !== -1 && offset <= end) {
              c = s.charAt(offset++);
            }
            attr.nodeValue = "";
            if (c === "'" || c === "\"") {
              attr.nodeValueDelim = c;
              ll = s.indexOf(c, offset);
              while (offset < ll) {
                attr.nodeValue += s.charAt(offset++);
              }
              offset++;
              c = s.charAt(offset++);
            } else {
              return "Malformed XHTML";
            }
          } else {
            return "Malformed XHTML";
          }
          pindex = attr.nodeName.indexOf(":");
          attr.prefix = pindex !== -1 ? attr.nodeName.substr(0, pindex) : "";
          attr.localName = pindex !== -1 ? attr.nodeName.substr(pindex + 1) : attr.nodeName;
          attrs.push(attr);
          attr = {};
        }
        pindex = n.nodeName.indexOf(":");
        n.prefix = pindex !== -1 ? n.nodeName.substr(0, pindex) : "";
        n.localName = pindex !== -1 ? n.nodeName.substr(pindex + 1) : n.nodeName;
        avt = false;
        var nextFirstpos = nsLookupLastpos + 1;
        for (var i = 0, l = attrs.length; i < l; i++) {
          attr = attrs[i];
          if (attr.nodeName === "xmlns") {
            namespaces[++nsLookupLastpos] = {prefix: "", namespaceURI: attr.nodeValue, htmlimplicit: false, xmlimplicit: false};
          } else if (attr.prefix === "xmlns") {
            namespaces[++nsLookupLastpos] = {prefix: attr.localName, namespaceURI: attr.nodeValue, htmlimplicit: false, xmlimplicit: false};
          }
        }
        nsi = nsLookupLastpos;
        while (nsi >= 0 && n.prefix !== namespaces[nsi].prefix) {
          nsi--;
        }
        if (nsi < 0) {
          return "Malformed XHTML";
        }
        n.namespaceURI = namespaces[nsi].namespaceURI;
        if (n.namespaceURI === xformsuri) {
          xformsinside = true;
        }
        if (n.localName === "model" && n.namespaceURI === xformsuri) {
          rsave = r;
          r = rmodel;
        }
        tablerepeat = n.namespaceURI === xformsuri && n.localName === "repeat" && tableelts.includes(parents[parents.length - 1].localName);
        if (tablerepeat) {
          r = r.substr(0, tableeltpos);
        } else {
          if (!xmlser && n.namespaceURI === xsuri) {
            r += "<script type=\"application/xml\">";
            xmlser = true;
            lt = "&lt;";
            gt = "&gt;";
            amp = "&amp;";
            nsLookupFirstpos = nextFirstpos;
          }
          r += "  ".repeat(Math.max(indentlevel,0)) + lt + (xmlser ? n.nodeName : (n.namespaceURI === xformsuri ? "xforms-" : "") + n.localName);
        }
        if (!namespaces[nsi][xmlser ? "xmlimplicit" : "htmlimplicit"] && nsi < nsLookupFirstpos) {
          nsattr = {};
          if (namespaces[nsi].prefix !== "") {
            nsattr.localName = namespaces[nsi].prefix;
            nsattr.prefix = "xmlns";
            nsattr.nodeName = nsattr.prefix + ":" + nsattr.localName;
          } else {
            nsattr.localName = "xmlns";
            nsattr.prefix = "";
            nsattr.nodeName = "xmlns";
          }
          nsattr.namespaceURI = xmlnsuri;
          nsattr.nodeValueDelim = "\"";
          nsattr.nodeValue = namespaces[nsi].namespaceURI;
          attrs.push(nsattr);
        }
        for (let i = 0, l = attrs.length; i < l; i++) {
          attr = attrs[i];
          if (attr.prefix !== "") {
            nsi = nsLookupLastpos;
            while (nsi >= 0 && attr.prefix !== namespaces[nsi].prefix) {
              nsi--;
            }
            if (nsi < 0) {
              return "Malformed XHTML";
            }
            attrs[i].namespaceURI = namespaces[nsi].namespaceURI;
            if (!namespaces[nsi][xmlser ? "xmlimplicit" : "htmlimplicit"] && nsi < nsLookupFirstpos) {
              nsattr = {};
              if (namespaces[nsi].prefix !== "") {
                nsattr.localName = namespaces[nsi].prefix;
                nsattr.prefix = "xmlns";
                nsattr.nodeName = nsattr.prefix + ":" + nsattr.localName;
              } else {
                nsattr.localName = "xmlns";
                nsattr.prefix = "";
                nsattr.nodeName = "xmlns";
              }
              nsattr.namespaceURI = xmlnsuri;
              nsattr.nodeValueDelim = "\"";
              nsattr.nodeValue = namespaces[nsi].namespaceURI;
              attrs.push(nsattr);
            }
          }
        }
        for (let i = 0, l = attrs.length; i < l; i++) {
          attr = attrs[i];
          if (xmlser || attr.localName !== "xmlns") {
            if (xmlser) {
              r += " " + (attr.prefix !== "" ? attr.prefix + ":" : "") + attr.localName + "=" + attr.nodeValueDelim + attr.nodeValue + attr.nodeValueDelim;
            } else if (n.localName === "html" && n.namespaceURI === htmluri && attr.prefix === "xmlns") {
              r += " xmlns-" + attr.localName + "=" + attr.nodeValueDelim + attr.nodeValue + attr.nodeValueDelim;
            } else if (attr.namespaceURI === xmlnsuri) {
              if (xmlnsattrs.includes(attr.localName) && attr.nodeValue === xlinkuri) {
                r += " xmlns:link=\"" + xlinkuri + "\"";
              }
            } else {
              if (attr.nodeValue.indexOf("{") !== -1) {
                if (!avt) {
                  r += " xf-avt";
                  avt = true;
                }
                r += " xf-template-" + (attr.namespaceURI === eventuri ? "ev-" : n.namespaceURI === xformsuri && attr.localName !== "id" && attr.localName !== "style" && attr.localName !== "class" ? "xf-" + (tablerepeat ? "repeat-" : "") : "") + attr.localName + "=" + attr.nodeValueDelim + attr.nodeValue + attr.nodeValueDelim;
              } else {
                r += " " + (attr.namespaceURI === eventuri ? "ev-" : n.namespaceURI === xformsuri && attr.localName !== "id" && attr.localName !== "style" && attr.localName !== "class" ? (tablerepeat ? "data-xf-repeat-" : "xf-") : "") + (n.namespaceURI === xformsuri && attr.localName === "nodeset" ? "ref" : attr.localName) + "=" + attr.nodeValueDelim + attr.nodeValue + attr.nodeValueDelim;
              }
            }
          }
        }
        if (s.charAt(offset - 1) !== "/") {
          if (tableelts.includes(n.localName) && n.namespaceURI === htmluri) {
            tableeltpos = r.length;
          }
          okindent = s.substr(offset).trim().startsWith("<");
          r += gt + (okindent ? "\n" : "");
          indentlevel++;
          if (n.localName === "html" && n.namespaceURI === htmluri) {
            r += "  ".repeat(Math.max(indentlevel,0)) + "<!--HTML elements generated by XSLTForms 1.6 (655) - Copyright (C) 2021 <agenceXML> - Alain Couthures - http://www.agencexml.com-->\n";
          } else if (n.localName === "head" && n.namespaceURI === htmluri) {
            r0 = r + "  ".repeat(Math.max(indentlevel,0)) + "<meta charset=\"UTF-8\">\n" + "  ".repeat(Math.max(indentlevel,0)) + xsltformscssfile + "\n" + "  ".repeat(Math.max(indentlevel,0)) + fleurjsfile + "\n" + "  ".repeat(Math.max(indentlevel,0)) + xsltformsjsfile + "\n";
            r = "";
          } else if (n.localName === "body" && n.namespaceURI === htmluri) {
            if (roptions !== "") {
              r += "  ".repeat(Math.max(indentlevel,0)) + "<xforms-options" + roptions + "/>";
            }
            r += rmodel;
          } else if (n.localName === "instance" && n.namespaceURI === xformsuri) {
            var mediatype = "application/xml";
            for (var i = 0, l = attrs.length; i < l; i++) {
              attr = attrs[i];
              if (attr.nodeName === "mediatype") {
                mediatype = attr.nodeValue;
                break;
              }
            }
            r += "  ".repeat(Math.max(indentlevel,0)) + lt + "script type=\"" + mediatype + "\"" + gt;
            xmlser = true;
            lt = "&lt;";
            gt = "&gt;";
            amp = "&amp;";
            nsLookupFirstpos = nsLookupLastpos + 1;
          }
          parents.push(n);
          //console.log("push " + n.nodeName);
          for (prefix in newnamespaces) {
            if (newnamespaces.hasOwnProperty(prefix)) {
              namespaces[prefix] = newnamespaces[prefix];
            }
          }
        } else if (!xmlser && emptyelts.includes(n.localName)) {
          r += gt + "\n";
        } else {
          if (!xmlser && n.localName === "head" && n.namespaceURI === htmluri) {
            r0 = r + gt + "\n";
            indentlevel--;
            r = "  ".repeat(Math.max(indentlevel,0)) + lt + "/head" + gt;
          }
          if (xmlser) {
            r += "/" + gt + "\n";
          } else {
            r += gt + lt + "/" + (n.namespaceURI === xformsuri ? "xforms-" : "") + n.localName + gt + "\n";
          }
        }
      }
      offset = index + 1;
      if (offset === 0) {
        break;
      }
    }
  }
  return "<!DOCTYPE html>\r\n" + Fleur.bin2utf8(r0) + Fleur.bin2utf8(r);
};
Fleur.Serializer.prototype.serializeToString = function(node, mediatype, indent) {
  var media = mediatype.split(";"), config = {}, param, paramreg = /^\s*(\S*)\s*=\s*(\S*)\s*$/, i = 1, l = media.length, handler, mime;
  while (i < l) {
    param = paramreg.exec(media[i]);
    config[param[1]] = param[2];
    i++;
  }
  mime = media[0].replace(/^\s+|\s+$/gm,'');
  if (mime.endsWith("+xml") && mime !== "application/exml+xml") {
    mime = "application/xml";
  }
  handler = Fleur.Serializer.Handlers[mime];
  if (!handler) {
    return "";
  }
  return handler(node, indent, config);
};
Fleur.Serializer.Handlers = {
  "application/xml": function(node, indent) {
    var ser = Fleur.Serializer._serializeXMLToString(node, indent, "");
    if (indent && ser.charAt(ser.length - 1) === "\n") {
      ser = ser.substr(0, ser.length - 1);
    }
    return ser;
  },
  "application/exml+xml": function(node, indent) {
    var ser = Fleur.Serializer._serializeEXMLToString(node, indent, "");
    if (indent && ser.charAt(ser.length - 1) === "\n") {
      ser = ser.substr(0, ser.length - 1);
    }
    return ser;
  },
  "application/xquery": function(node) {
    return Fleur.Serializer._serializeNodeToXQuery(node);
  },
  "text/csv": function(node, indent, config) {
    if (node.nodeType === Fleur.Node.SEQUENCE_NODE) {
      return Fleur.Serializer._serializeMatrixToString(node, config.header === "present", config.separator ? decodeURIComponent(config.separator) : ",");
    }
    return Fleur.Serializer._serializeCSVToString(node, config.header === "present", config.key ? parseInt(config.key, 10) : null, config.separator ? decodeURIComponent(config.separator) : ",", 0);
  },
  "text/plain": function(node) {
    return node.textContent;
  },
  "application/json": function(node, indent) {
    var ser = Fleur.Serializer._serializeJSONToString(node, indent, "", false, "");
    if (indent && ser.charAt(ser.length - 1) === "\n") {
      ser = ser.substr(0, ser.length - 1);
    }
    return ser;
  },
  "text/html": function(node, indent) {
    var ser = Fleur.Serializer._serializeHTMLToString(node, indent, "");
    if (indent && ser.charAt(ser.length - 1) === "\n") {
      ser = ser.substr(0, ser.length - 1);
    }
    return ser;
  }
};
Fleur.Serializer.Handlers["text/xml"] = Fleur.Serializer.Handlers["application/xml"];
Fleur.Serializer.Handlers["application/xquery+xml"] = Fleur.Serializer.Handlers["application/xml"];
Fleur.Serializer.Handlers["text/json"] = Fleur.Serializer.Handlers["application/json"];