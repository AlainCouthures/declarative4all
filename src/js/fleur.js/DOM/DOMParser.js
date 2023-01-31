"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.DOMParser = function() {};
Fleur.DOMParser._appendFromCSVString = function(node, s, config) {
  var offset = 0, end, sep, head = config.header === "present", ignore;
  var first = head;
  var row, a;
  sep = config.separator ? decodeURIComponent(config.separator) : ",";
  s = s.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
  if (s.charAt(s.length - 1) !== "\n") {
    s += "\n";
  }
  ignore = Math.max(parseInt(config.ignore, 10) || 0, 0);
  end = s.length;
  if (ignore !== 0) {
    while (offset !== end) {
      if (s.charAt(offset) === "\n") {
        ignore--;
        if (ignore === 0) {
          offset++;
          break;
        }
      }
      offset++;
    }
  }
  row = new Fleur.Multidim();
  if (head) {
    node.collabels = [];
  }
  while (offset !== end) {
    var v = "";
    if (s.charAt(offset) === '"') {
      offset++;
      do {
        if (s.charAt(offset) !== '"') {
          v += s.charAt(offset);
          offset++;
        } else {
          if (s.substr(offset, 2) === '""') {
            v += '"';
            offset += 2;
          } else {
            offset++;
            break;
          }
        }
      } while (offset !== end);
    } else {
      while (s.substr(offset, sep.length) !== sep && s.charAt(offset) !== "\n") {
        v += s.charAt(offset);
        offset++;
      }
    }
    if (first) {
      node.collabels.push(v);
    } else {
      a = new Fleur.Text();
      a.data = v;
      a.schemaTypeInfo = Fleur.Type_untypedAtomic;
      row.appendChild(a);
    }
    if (s.charAt(offset) === "\n") {
      if (!first) {
        node.appendChild(row);
      }
      row = new Fleur.Multidim();
      first = false;
    }
    offset++;
  }
  if (node.childNodes.length < 2) {
    node.childNodes = node.childNodes[0].childNodes;
  }
};
/*
Fleur.DOMParser._appendFromCSVString_old = function(node, s, config) {
  var offset = 0, end, doc = node.ownerDocument || node, eltnode, sep, head = config.header === "present", ignore;
  var headers = [];
  var first = head;
  var col = 0;
  var rowcat = "";
  var key = config.key ? parseInt(config.key, 10) : null;
  var currparent;
  var mapnode;
  sep = config.separator ? decodeURIComponent(config.separator) : ",";
  s = s.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
  if (s.charAt(s.length - 1) !== "\n") {
    s += "\n";
  }
  ignore = Math.max(parseInt(config.ignore, 10) || 0, 0);
  end = s.length;
  if (ignore !== 0) {
    while (offset !== end) {
      if (s.charAt(offset) === "\n") {
        ignore--;
        if (ignore === 0) {
          offset++;
          break;
        }
      }
      offset++;
    }
  }
  if (key !== null) {
    mapnode = doc.createMap();
    currparent = new Fleur.Entry();
    currparent._setOwnerDocument(node);
    currparent.childNodes = new Fleur.NodeList();
    currparent.children = new Fleur.NodeList();
  } else {
    currparent = doc.createArray();
  }
  while (offset !== end) {
    var v = "";
    if (s.charAt(offset) === '"') {
      offset++;
      do {
        if (s.charAt(offset) !== '"') {
          v += s.charAt(offset);
          offset++;
        } else {
          if (s.substr(offset, 2) === '""') {
            v += '"';
            offset += 2;
          } else {
            offset++;
            break;
          }
        }
      } while (offset !== end);
    } else {
      while (s.substr(offset, sep.length) !== sep && s.charAt(offset) !== "\n") {
        v += s.charAt(offset);
        offset++;
      }
    }
    if (first) {
      headers.push(v);
      if (col === key) {
        eltnode = doc.createElement(headers[col]);
        eltnode.appendChild(mapnode);
        node.appendChild(eltnode);
      }
    } else {
      rowcat += v;
      if (col === key) {
        currparent.nodeName = currparent.localName = v;
      } else {
        if (head) {
          eltnode = doc.createElement(headers[col]);
          if (v !== "") {
            eltnode.appendChild(doc.createTextNode(v));
          }
          currparent.appendChild(eltnode);
        } else {
          currparent.appendChild(doc.createTextNode(v));
        }
      }
    }
    if (s.charAt(offset) === "\n") {
      if (!first && rowcat !== "") {
        if (key !== null) {
          mapnode.setEntryNode(currparent);
          currparent = new Fleur.Entry();
          currparent._setOwnerDocument(node);
          currparent.childNodes = new Fleur.NodeList();
          currparent.children = new Fleur.NodeList();
        } else {
          node.appendChild(currparent);
          currparent = doc.createArray();
        }
      }
      first = false;
      col = 0;
      rowcat = "";
    } else {
      col++;
    }
    offset++;
  }
  if (key !== null && !head) {
    node.appendChild(mapnode);
  }
};
Fleur.DOMParser._appendFromXMLString = function(node, s) {
  var ii, ll, text, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrs, parents = [], doc = node.ownerDocument || node, currnode = node, eltnode, attrnode, c,
    seps_pi = " \t\n\r?", seps_dtd = " \t\n\r[>", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=", seps = " \t\n\r",
    n, namespaces = {}, newnamespaces = {}, pindex, prefix, localName, dtdtype, dtdpublicid, dtdsystemid, entityvalue, notationvalue;
  while (offset !== end) {
    index = s.indexOf("<", offset);
    if (index !== offset) {
      if (index === -1) {
        index = end;
      }
      s = s.substr(0, offset) + Fleur.DocumentType.resolveEntities(doc.doctype, s.substring(offset, index)) + s.substr(index);
      index = s.indexOf("<", offset);
      end = s.length;
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
        currnode.appendChild(doc.createTextNode(text));
        if (index === end) {
          break;
        }
      }
      offset = index;
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
          text = text.replace(/\x01/gm,"<");
          currnode.appendChild(doc.createComment(text));
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
          currnode.appendChild(doc.createCDATASection(text));
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
        currnode.appendChild(doc.doctype = doc.implementation.createDocumentType(nodename, dtdpublicid, dtdsystemid));
        doc.doctype.ownerDocument = doc;
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
              doc.doctype.setEntity(nodename, entityvalue);
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
      } else if (nodename !== "") {
        text = "";
        ii = offset;
        while (ii < index) {
          text += s.charAt(ii++);
        }
        text = text.replace(/\x01/gm,"<");
        currnode.appendChild(doc.createProcessingInstruction(nodename, index === offset - 1 ? "" : text));
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
      if (nodename === currnode.nodeName) {
        n = parents.pop();
        namespaces = {};
        for (prefix in n.namespaces) {
          if (n.namespaces.hasOwnProperty(prefix)) {
            namespaces[prefix] = n.namespaces[prefix];
          }
        }
        currnode = n.node;
      } else {
        while (parents.length !== 0) {
          n = parents.pop();
          if (nodename === n.node.nodeName) {
            namespaces = {};
            for (prefix in n.namespaces) {
              if (n.namespaces.hasOwnProperty(prefix)) {
                namespaces[prefix] = n.namespaces[prefix];
              }
            }
            currnode = n.node;
            break;
          }
        }
      }
      offset = s.indexOf(">", offset - 1) + 1;
      if (offset === 0) {
        break;
      }
    } else {
      c = s.charAt(offset++);
      nodename = "";
      while (seps_elt.indexOf(c) === -1 && offset <= end) {
        nodename += c;
        c = s.charAt(offset++);
      }
      index = s.indexOf(">", offset - 1);
      if (nodename !== "") {
        newnamespaces = {};
        for (prefix in namespaces) {
          if (namespaces.hasOwnProperty(prefix)) {
            newnamespaces[prefix] = namespaces[prefix];
          }
        }
        attrs = {};
        while (offset <= end) {
          while (seps.indexOf(c) !== -1) {
            c = s.charAt(offset++);
          }
          if (c === "/" || c === ">" || offset === end) {
            break;
          }
          attrname = "";
          while (seps_attr.indexOf(c) === -1 && offset <= end) {
            attrname += c;
            c = s.charAt(offset++);
          }
          while (seps.indexOf(c) !== -1) {
            c = s.charAt(offset++);
          }
          if (c === "=") {
            c = s.charAt(offset++);
            while (seps.indexOf(c) !== -1) {
              c = s.charAt(offset++);
            }
            attrvalue = "";
            if (c === "'" || c === "\"") {
              attrvalue = "";
              ii = offset;
              ll = Math.min(index - 1, s.indexOf(c, offset));
              while (ii < ll) {
                attrvalue += s.charAt(ii++);
              }
              offset += attrvalue.length + 1;
              c = s.charAt(offset++);
            } else {
              while (seps_elt.indexOf(c) === -1 && offset <= end) {
                attrvalue += c;
                c = s.charAt(offset++);
              }
            }
          } else {
            attrvalue = attrname;
          }
          pindex = attrname.indexOf(":");
          prefix = pindex !== -1 ? attrname.substr(0, pindex) : " ";
          localName = pindex !== -1 ? attrname.substr(pindex + 1) : attrname;
          if (!attrs[prefix]) {
            attrs[prefix] = {};
          }
          attrs[prefix][localName] = attrvalue;
          if (prefix === "xmlns") {
            newnamespaces[localName] = attrvalue;
          } else if (prefix === " " && localName === "xmlns") {
            newnamespaces[" "] = attrvalue;
          }
        }
        pindex = nodename.indexOf(":");
        eltnode = doc.createElementNS(newnamespaces[pindex !== -1 ? nodename.substr(0, pindex) : " "], nodename);
        for (prefix in attrs) {
          if (attrs.hasOwnProperty(prefix)) {
            for (attrname in attrs[prefix]) {
              if (attrs[prefix].hasOwnProperty(attrname)) {
                attrnode = doc.createAttributeNS(prefix === "xmlns" || prefix === " " && attrname === "xmlns" ? "http://www.w3.org/2000/xmlns/" : prefix === "xml" ? "http://www.w3.org/XML/1998/namespace" : prefix !== " " ? newnamespaces[prefix] : null, prefix !== " " ? prefix + ":" + attrname : attrname);
                eltnode.setAttributeNodeNS(attrnode);
                attrnode.appendChild(doc.createTextNode(Fleur.DocumentType.resolveEntities(doc.doctype, attrs[prefix][attrname]).replace(/\x01/gm,"<")));
              }
            }
          }
        }
        currnode.appendChild(eltnode);
        if (s.charAt(offset - 1) !== "/") {
          parents.push({node: currnode, namespaces: namespaces});
          currnode = eltnode;
          namespaces = {};
          for (prefix in newnamespaces) {
            if (newnamespaces.hasOwnProperty(prefix)) {
              namespaces[prefix] = newnamespaces[prefix];
            }
          }
        }
      }
      offset = index + 1;
      if (offset === 0) {
        break;
      }
    }
  }
};
Fleur.DocumentType.resolveEntities = function(doctype, s) {
  var offset = 0, index, entityname, entityvalue = null;
  while ((index = s.indexOf("&", offset)) !== -1) {
    entityname = s.substring(index + 1, s.indexOf(";", index + 1));
    switch (entityname) {
      case "amp":
        entityvalue = "&";
        break;
      case "lt":
        entityvalue = "\x01";
        break;
      case "gt":
        entityvalue = ">";
        break;
      case "apos":
        entityvalue = "'";
        break;
      case "quot":
        entityvalue = '"';
        break;
      default:
        if (entityname.charAt(0) === "#") {
          entityvalue = String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? "0" + entityname.substr(1).toLowerCase() : entityname.substr(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
        } else if (doctype) {
          entityvalue = doctype.getEntity(entityname);
        }
    }
    if (entityvalue) {
      s = s.substr(0, index) + entityvalue + s.substr(index + entityname.length + 2);
      offset = index + entityvalue.length + 1;
    } else {
      break;
    }
  }
  return s.split("\r\n").join("\n");
};*/
Fleur.DOMParser._appendFromXMLString = function(node, s, leaftags) {
  var ii, ll, text, entstart, entityname, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrs, parents = [], doc = node.ownerDocument || node, currnode = node, eltnode, attrnode, c,
    seps_pi = " \t\n\r?", seps_dtd = " \t\n\r[>", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r",
    n, namespaces = {}, newnamespaces = {}, pindex, prefix, localName, dtdtype, dtdpublicid, dtdsystemid, entityvalue, notationvalue, uri;
  while (offset !== end) {
    text = "";
    c = s.charAt(offset);
    while (c !== "<" && offset !== end) {
      if (c === "&") {
        c = s.charAt(++offset);
        entstart = offset;
        entityname = "";
        while (c !== ";" && offset !== end) {
          entityname += c;
          c = s.charAt(++offset);
        }
        if (offset === end) {
          break;
        }
        entityvalue = "";
        switch (entityname) {
          case "amp":
            text += "&";
            break;
          case "lt":
            text += "<";
            break;
          case "gt":
            text += ">";
            break;
          case "apos":
            text += "'";
            break;
          case "quot":
            text += '"';
            break;
          default:
            if (entityname.charAt(0) === "#") {
              text += String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? "0" + entityname.substr(1).toLowerCase() : entityname.substr(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
            } else if (doc.doctype) {
              entityvalue = doc.doctype.getEntity(entityname);
              s = s.substr(0, entstart) + entityvalue + s.substr(offset + 1);
              offset = entstart;
              end = s.length;
            }
        }
      } else {
        text += c;
      }
      c = s.charAt(++offset);
    }
    if (text !== "") {
      currnode.appendChild(doc.createTextNode(text));
    }
    if (offset === end) {
      break;
    }
    if (leaftags && leaftags.indexOf(currnode.nodeName) !== -1) {
      if (currnode.firstChild.data.endsWith("\r\n")) {
        currnode.firstChild.data = currnode.firstChild.data.substring(0, currnode.firstChild.data.length - 2);
      }
      n = parents.pop();
      namespaces = {};
      for (prefix in n.namespaces) {
        if (n.namespaces.hasOwnProperty(prefix)) {
          namespaces[prefix] = n.namespaces[prefix];
        }
      }
      currnode = n.node;
    }
    /*
    index = s.indexOf("<", offset);
    if (index !== offset) {
      if (index === -1) {
        index = end;
      }
      s = s.substr(0, offset) + Fleur.DocumentType.resolveEntities(doc.doctype, s.substring(offset, index)) + s.substr(index);
      index = s.indexOf("<", offset);
      end = s.length;
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
        currnode.appendChild(doc.createTextNode(text));
        if (index === end) {
          break;
        }
      }
      offset = index;
    }*/
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
          text = text.replace(/\x01/gm,"<");
          currnode.appendChild(doc.createComment(text));
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
          currnode.appendChild(doc.createCDATASection(text));
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
        currnode.appendChild(doc.doctype = doc.implementation.createDocumentType(nodename, dtdpublicid, dtdsystemid));
        doc.doctype.ownerDocument = doc;
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
              doc.doctype.setEntity(nodename, entityvalue);
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
        currnode.appendChild(doc.createProcessingInstruction(nodename, index === offset - 1 ? "" : text));
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
      if (nodename === currnode.nodeName) {
        n = parents.pop();
        namespaces = {};
        for (prefix in n.namespaces) {
          if (n.namespaces.hasOwnProperty(prefix)) {
            namespaces[prefix] = n.namespaces[prefix];
          }
        }
        currnode = n.node;
      } else {
        while (parents.length !== 0) {
          n = parents.pop();
          if (nodename === n.node.nodeName) {
            namespaces = {};
            for (prefix in n.namespaces) {
              if (n.namespaces.hasOwnProperty(prefix)) {
                namespaces[prefix] = n.namespaces[prefix];
              }
            }
            currnode = n.node;
            break;
          }
        }
      }
      offset = s.indexOf(">", offset - 1) + 1;
      if (offset === 0) {
        break;
      }
    } else {
      c = s.charAt(offset++);
      nodename = "";
      while (seps_elt.indexOf(c) === -1 && offset <= end) {
        nodename += c;
        c = s.charAt(offset++);
      }
      index = s.indexOf(">", offset - 1);
      if (nodename !== "") {
        newnamespaces = {};
        for (prefix in namespaces) {
          if (namespaces.hasOwnProperty(prefix)) {
            newnamespaces[prefix] = namespaces[prefix];
          }
        }
        attrs = {};
        while (offset <= end) {
          while (seps.indexOf(c) !== -1) {
            c = s.charAt(offset++);
          }
          if (c === "/" || c === ">" || offset === end) {
            break;
          }
          attrname = "";
          while (seps_attr.indexOf(c) === -1 && offset <= end) {
            attrname += c;
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
            attrvalue = "";
            if (c === "'" || c === "\"") {
              attrvalue = "";
              ii = offset;
              ll = Math.min(index - 1, s.indexOf(c, offset));
              while (ii < ll) {
                attrvalue += s.charAt(ii++);
              }
              offset += attrvalue.length + 1;
              c = s.charAt(offset++);
            } else {
              while (seps_elt.indexOf(c) === -1 && offset <= end) {
                attrvalue += c;
                c = s.charAt(offset++);
              }
            }
          } else {
            attrvalue = attrname;
          }
          pindex = attrname.indexOf(":");
          prefix = pindex !== -1 ? attrname.substr(0, pindex) : " ";
          localName = pindex !== -1 ? attrname.substr(pindex + 1) : attrname;
          if (!attrs[prefix]) {
            attrs[prefix] = {};
          }
          attrs[prefix][localName] = attrvalue;
          if (prefix === "xmlns") {
            newnamespaces[localName] = attrvalue;
          } else if (prefix === " " && localName === "xmlns") {
            newnamespaces[" "] = attrvalue;
          }
        }
        pindex = nodename.indexOf(":");
        uri = newnamespaces[pindex !== -1 ? nodename.substr(0, pindex) : " "];
        eltnode = doc.createElementNS(uri, nodename);
        if (!doc._elementsByTagName[uri]) {
          doc._elementsByTagName[uri] = {};
          doc._elementsByTagName[uri][nodename] = [eltnode];
        } else if (!doc._elementsByTagName[uri][nodename]) {
          doc._elementsByTagName[uri][nodename] = [eltnode];
        } else {
          doc._elementsByTagName[uri][nodename].push(eltnode);
        }
        for (prefix in attrs) {
          if (attrs.hasOwnProperty(prefix)) {
            for (attrname in attrs[prefix]) {
              if (attrs[prefix].hasOwnProperty(attrname)) {
                attrvalue = Fleur.DocumentType.resolveEntities(doc.doctype, attrs[prefix][attrname]).replace(/\x01/gm,"<");
                if (attrname === "id" && (prefix === " " || prefix === "xml")) {
                  doc._elementById[attrvalue] = eltnode;
                }
                attrnode = doc.createAttributeNS(prefix === "xmlns" || prefix === " " && attrname === "xmlns" ? "http://www.w3.org/2000/xmlns/" : prefix === "xml" ? "http://www.w3.org/XML/1998/namespace" : prefix !== " " ? newnamespaces[prefix] : null, prefix !== " " ? prefix + ":" + attrname : attrname);
                eltnode.setAttributeNodeNS(attrnode);
                attrnode.appendChild(doc.createTextNode(attrvalue));
              }
            }
          }
        }
        currnode.appendChild(eltnode);
        if (s.charAt(offset - 1) !== "/") {
          parents.push({node: currnode, namespaces: namespaces});
          currnode = eltnode;
          namespaces = {};
          for (prefix in newnamespaces) {
            if (newnamespaces.hasOwnProperty(prefix)) {
              namespaces[prefix] = newnamespaces[prefix];
            }
          }
        }
      }
      offset = index + 1;
      if (offset === 0) {
        break;
      }
    }
  }
};
Fleur.DOMParser._parseTextAdvance = function(n, states, grammar, selection) {
  for (var i = 0; i < states[n].length; i++) {
    var state = states[n][i];
    if (state[2] === state[1].length) {
      var join = [];
      var prevtext = false;
      for (var j = 0, l = state[4].length; j < l ; j++) {
        if (state[4][j] !== "") {
          if (state[1][j][0] === 2 && !state[1][j][2]) {
            if (prevtext && typeof (state[4][j][1][0]) === "string") {
              join[join.length - 1] += state[4][j][1][0];
            } else {
              join = join.concat(state[4][j][1]);
              prevtext = typeof (state[4][j][1][0]) === "string";
            }
          } else if (state[1][j][2]) {
            if (state[1][j][0] === 2) {
              join.push([state[1][j][2], state[4][j][1]]);
              prevtext = false;
            } else {
              var joinitem = state[4][j];
              if (prevtext) {
                join[join.length - 1] += joinitem;
              } else if (joinitem !== "") {
                join.push(joinitem);
                prevtext = true;
              }
            }
          }
        }
      }
      state[4] = [[1, join]];
      for (var k = 0; k < states[state[3]].length; k++) {
        var state2 = states[state[3]][k];
        if (state2[1][state2[2]] && state2[1][state2[2]][0] === 2 && state2[1][state2[2]][1] === state[0]) {
          var data3 = state2[4].slice(0);
          data3.push(state[4][0]);
          states[n].push([state2[0], state2[1], state2[2] + 1, state2[3], data3]);
        }
      }
    } else {
      if (state[1][state[2]][0] === 2) {
        var next = state[1][state[2]][1];
        for (var i2 = 0, l2 = grammar[next].length; i2 < l2; i2++) {
          var r = grammar[next][i2];
          if (selection.indexOf(r) === -1) {
            if (r.length > 0) {
              selection.push(r);
              states[n].push([next, r, 0, n, []]);
            } else {
              var data4 = state[4].slice(0);
              data4.push("");
              states[n].push([state[0], state[1], state[2] + 1, state[3], data4]);
            }
          }
        }
      }
    }
  }
};
Fleur.DOMParser._appendFromGrammarString = function(node, s, grammar) {
  var states = [[]];
  var selection = [];
  for (var i = 0, l = grammar[0][0].length; i < l; i++) {
    selection[i] = grammar[0][0][i];
    states[0][i] = [0, grammar[0][0][i], 0, 0, []];
  }
  Fleur.DOMParser._parseTextAdvance(0, states, grammar[0], selection);
  for (var j = 0; j < s.length; j++) {
    states[j + 1] = [];
    for (var k = 0; k < states[j].length; k++) {
      var state = states[j][k];
      var c = s.charAt(j);
      if (state[1][state[2]]) {
        if ((state[1][state[2]][0] === 0 && state[1][state[2]][1] === c) || (state[1][state[2]][0] === 1 && state[1][state[2]][1].test(c))) {
          var data = state[4].slice(0);
          data.push(c);
          states[j + 1].push([state[0], state[1], state[2] + 1, state[3], data]);
        }
      }
    }
    Fleur.DOMParser._parseTextAdvance(j + 1, states, grammar[0], []);
    if (states[states.length - 1].length === 0) {
      return "error";
    }
  }
  var laststates = states[states.length - 1];
  for (i = 0, l = laststates.length; i < l; i++) {
    if (laststates[i][0] === 0 && laststates[i][1].length === laststates[i][2] && laststates[i][3] === 0) {
      Fleur.DOMParser._appendFromArray(node, grammar[1], [laststates[i][4][0]]);
      break;
    }
  }
  return node;
};
Fleur.DOMParser._appendFromZIP = function(node, s) {
  var f, doc = node.ownerDocument || node, filename;
  var m = doc.createMap();
  node.appendChild(m);
  var offset = s.lastIndexOf("PK\x05\x06") + 16;
  var r2 = function() {
    return offset += 2, ((s.charCodeAt(offset - 1) & 0xFF) << 8) | s.charCodeAt(offset - 2) & 0xFF;
  };
  var r4 = function() {
    return offset += 4, ((((((s.charCodeAt(offset - 1) & 0xFF) << 8) | s.charCodeAt(offset - 2) & 0xFF) << 8) | s.charCodeAt(offset - 3) & 0xFF) << 8) | s.charCodeAt(offset - 4) & 0xFF;
  };
  offset = r4();
  while (s.charCodeAt(offset) === 80 && s.charCodeAt(offset + 1) === 75 && s.charCodeAt(offset + 2) === 1 && s.charCodeAt(offset + 3) === 2) {
    f = {};
    offset += 4;
    f.versionMadeBy = r2();
    f.versionNeeded = r2();
    f.bitFlag = r2();
    f.compressionMethod = r2();
    f.date = r4();
    f.crc32 = r4();
    f.compressedSize = r4();
    f.uncompressedSize = r4();
    f.fileNameLength = r2();
    f.extraFieldsLength = r2();
    f.fileCommentLength = r2();
    f.diskNumber = r2();
    f.internalFileAttributes = r2();
    f.externalFileAttributes = r4();
    f.localHeaderOffset = r4();
    filename = s.substr(offset, f.fileNameLength);
    offset += f.fileNameLength;
    f.extraFields = s.substr(offset, f.extraFieldsLength);
    offset += f.extraFieldsLength;
    f.fileComment = s.substr(offset, f.fileCommentLength);
    offset += f.fileCommentLength;
    f.dir = f.externalFileAttributes & 0x00000010 ? true : false;
    var offset2 = offset;
    offset = f.localHeaderOffset + 28;
    f.lextraFieldsLength = r2();
    offset += f.fileNameLength;
    f.lextraFields = s.substr(offset, f.lextraFieldsLength);
    offset += f.lextraFieldsLength;
    f.compressedFileData = s.substr(offset, f.compressedSize);
    offset = offset2;
    var e = doc.createEntry(filename);
    Fleur.DOMParser._appendFromJSON(e, f);
    m.setEntryNode(e);
  }
  return node;
};
Fleur.DOMParser._appendFromArray = function(node, names, os) {
  var i, l, o, n, nodename, doc = node.ownerDocument || node;
  for (i = 0, l = os.length; i < l; i++) {
    o = os[i];
    if (typeof o === "string") {
      if (o === "") {
        continue;
      }
      n = doc.createTextNode(o);
    } else {
      nodename = names[1][o[0]];
      switch (nodename[0]) {
        case Fleur.Node.ELEMENT_NODE:
          n = doc.createElementNS(names[0][nodename[1]], nodename[2]);
          Fleur.DOMParser._appendFromArray(n, names, o[1]);
          break;
        case Fleur.Node.ATTRIBUTE_NODE:
          n = doc.createAttributeNS(names[0][nodename[1]], nodename[2]);
          n.nodeValue = o[1][0];
          node.setAttributeNodeNS(n);
          continue;
        case Fleur.Node.CDATA_NODE:
          n = doc.createCDATASection(o[1][0]);
          break;
        case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
          n = doc.createProcessingInstruction(o[1], o[2]);
          break;
        case Fleur.Node.COMMENT_NODE:
          n = doc.createComment(o[1][0]);
          break;
      }
    }
    node.appendChild(n);
  }
  return node;
};
Fleur.DOMParser.prototype.parseFromArray = function(o) {
  var doc, impl, domSource = new Fleur.DOMImplementationSource();
  impl = domSource.getDOMImplementation("XML");
  doc = impl.createDocument();
  return Fleur.DOMParser._appendFromArray(doc, o[0], o[1]);
};
Fleur.DOMParser._appendFromEXML = function(node, enode) {
  var i, l;
  if (enode.nodeType === Fleur.Node.ELEMENT_NODE) {
    switch (enode.localName) {
      case "element":
    }
    i = 0;
    l = enode.childNodes.length;
    while (i < l) {
      i++;
    }
  } else if (enode.nodeType === Fleur.Node.TEXT_NODE && enode.textContent.trim() !== "") {
    node.appendChild(node.ownerDocument.importNode(enode, true));
  }
};
Fleur.DOMParser._appendFromJSON = function(node, o) {
  if (o === null) {
    return;
  }
  var doc = node.ownerDocument || node, n;
  switch (typeof o) {
    case "string":
      n = doc.createTypedValueNode("http://www.w3.org/2001/XMLSchema", "string", o);
      break;
    case "number":
      n = doc.createTypedValueNode("http://www.w3.org/2001/XMLSchema", "double", o);
      break;
    case "boolean":
      n = doc.createTypedValueNode("http://www.w3.org/2001/XMLSchema", "boolean", o);
      break;
    default:
      if (o instanceof RegExp) {
        n = doc.createTypedValueNode("http://www.agencexml.com/types", "regex", o);
      } else if (typeof o.length === "number") {
        n = doc.createArray();
        for (var i = 0, l = o.length; i < l; i++) {
          Fleur.DOMParser._appendFromJSON(n, o[i]);
        }
      } else {
        n = doc.createMap();
        for (var k in o) {
          if (o.hasOwnProperty(k)) {
            var e = doc.createEntry(k);
            n.setEntryNode(e);
            Fleur.DOMParser._appendFromJSON(e, o[k]);
          }
        }
      }
  }
  node.appendChild(n);
  return node;
};
Fleur.DOMParser._appendFromMD = function(node, s) {
  var lines = s.split("\n");
  var items = [], lseps = [];
  var blocks = [];
  var ser = "";
  for (var i = 0, l = lines.length; i < l; i++) {
    if (lines[i].trim() !== "") {
      items.push(lines[i]);
      lseps.push(0);
    } else if (lseps.length !== 0) {
      lseps[lseps.length - 1]++;
    }
  }
  var dashtrim = function(s) {
    var t = s.trim();
    for (var i0 = t.length - 1; i0 >= 0; i0--) {
      if (t.charAt(i0) !== "#") {
        return t.substr(0, i0 + 1).trim();
      }
    }
    return "";
  };
  var oi;
  var outol = true;
  var pol = false;
  var orderitem = function(s) {
    oi = 0;
    var c = s.charCodeAt(oi);
    if (outol || c !== 42 || c !== 43 || c !== 45) {
      while (c >= 48 && c <= 57) {
        oi++;
        c = s.charCodeAt(oi);
      }
      return c === 46 && oi !== 0 && s.charCodeAt(oi + 1) === 32 ? oi + 2 : -1;
    }
    return s.charCodeAt(1) === 32 ? 2 : -1;
  };
  var ui;
  var outul = true;
  var pul = false;
  var unorderitem = function(s) {
    ui = 0;
    var c = s.charCodeAt(ui);
    if (c === 42 || c === 43 || c === 45) {
      return s.charCodeAt(1) === 32 ? 2 : -1;
    }
    while (c >= 48 && c <= 57) {
      ui++;
      c = s.charCodeAt(ui);
    }
    return !outul && c === 46 && ui !== 0 && s.charCodeAt(ui + 1) === 32 ? ui + 2 : -1;
  };
  var inlinemd = function(s) {
    var r = "";
    var outem = true;
    var outstrong = true;
    var outdel = true;
    for (var il = 0, ll = s.length; il < ll; il++) {
      var c = s.charAt(il);
      if (c === "*" || c === "_") {
        if (s.charAt(il + 1) === c) {
          if ((outstrong && s.substr(il + 2).indexOf(c + c) !== -1) || !outstrong) {
            r += "<" + (outstrong ? "" : "/") + "strong>";
            outstrong = !outstrong;
            il++;
          } else {
            r += c + c;
          }
        } else {
          if ((outem && s.substr(il + 1).replace(c + c, "").indexOf(c) !== -1) || !outem) {
            r += "<" + (outem ? "" : "/") + "em>";
            outem = !outem;
          } else {
            r += c;
          }
        }
      } else if (c === "~" && s.charAt(il + 1) === "~") {
        if ((outdel && s.substr(il + 2).indexOf("~~") !== -1) || !outdel) {
          r += "<" + (outdel ? "" : "/") + "del>";
          outdel = !outdel;
          il++;
        } else {
          r += "~~";
        }
      } else {
        r += c;
      }
    }
    return r;
  };
  var lastli = 0;
  for (i = 0, l = items.length; i < l; i++) {
    if (items[i].startsWith("# ")) {
      blocks.push(["h1", inlinemd(dashtrim(items[i].substr(2)))]);
    } else if (items[i].startsWith("## ")) {
      blocks.push(["h2", inlinemd(dashtrim(items[i].substr(3)))]);
    } else if (items[i].startsWith("### ")) {
      blocks.push(["h3", inlinemd(dashtrim(items[i].substr(4)))]);
    } else if (items[i].startsWith("#### ")) {
      blocks.push(["h4", inlinemd(dashtrim(items[i].substr(5)))]);
    } else if (items[i].startsWith("##### ")) {
      blocks.push(["h5", inlinemd(dashtrim(items[i].substr(6)))]);
    } else if (items[i].startsWith("###### ")) {
      blocks.push(["h6", inlinemd(dashtrim(items[i].substr(7)))]);
    } else if (items[i].startsWith("---") && items[i].trim() === "-".repeat(items[i].trim().length)) {
      if (blocks.length === 0 || blocks[blocks.length - 1][0] !== "p" || lseps[i - 1] !== 0) {
        blocks.push(["hr"]);
      } else  {
        blocks[blocks.length - 1][0] = "h2";
      }
    } else if (items[i].startsWith("===") && items[i].trim() === "=".repeat(items[i].trim().length) && blocks.length !== 0 && blocks[blocks.length - 1][0] === "p" && lseps[i - 1] === 0) {
      blocks[blocks.length - 1][0] = "h1";
    } else if (orderitem(items[i]) !== -1 && outul) {
      if (outol) {
        pol = false;
      }
      blocks.push(["", (outol ? "<ol><li>" : "<li>") + (lseps[i] !== 0 || pol ? "<p>" : "") + inlinemd(items[i].substr(oi + 1).trim()) + (lseps[i] !== 0 || pol ? "</p>" : "") + "</li></ol>"]);
      if (!outol) {
        blocks[lastli][1] = blocks[lastli][1].substr(0, blocks[lastli][1].length - 5);
      }
      lastli = blocks.length - 1;
      outol = false;
      pol = lseps[i] !== 0;
    } else if (unorderitem(items[i]) !== -1) {
      if (outul) {
        pul = false;
      }
      blocks.push(["", (outul ? "<ul><li>" : "<li>") + (lseps[i] !== 0 || pul ? "<p>" : "") + inlinemd(items[i].substr(oi + 1).trim()) + (lseps[i] !== 0 || pul ? "</p>" : "") + "</li></ul>"]);
      if (!outul) {
        blocks[lastli][1] = blocks[lastli][1].substr(0, blocks[lastli][1].length - 5);
      }
      lastli = blocks.length - 1;
      outul = false;
      pul = lseps[i] !== 0;
    } else if (blocks.length === 0 || blocks[blocks.length - 1][0] !== "p" || lseps[i - 1] !== 0) {
      blocks.push(["p", [inlinemd(items[i])]]);
    } else {
      blocks[blocks.length - 1][1].push(inlinemd(items[i]));
    }
  }
  for (i = 0, l = blocks.length; i < l; i++) {
    if (blocks[i][0] !== "") {
      ser += "<" + blocks[i][0] + ">";
    }
    if (blocks[i][0] === "p") {
      for (var j = 0, l2 = blocks[i][1].length; j < l2; j++) {
        if (j !== 0) {
          ser += "<br/>";
        }
        ser += blocks[i][1][j];
      }
    } else if (blocks[i].length === 2) {
      ser += blocks[i][1];
    }
    if (blocks[i][0] !== "") {
      ser += "</" + blocks[i][0] + ">";
    }
  }
  if (node.nodeType === Fleur.Node.DOCUMENT_NODE) {
    ser = "<div>" + ser + "</div>";
  }
  Fleur.DOMParser._appendFromXMLString(node, ser);
  return node;
};
Fleur.DOMParser.prototype.parseFromJSON = function(o) {
  var doc, impl, domSource = new Fleur.DOMImplementationSource();
  impl = domSource.getDOMImplementation("XML");
  doc = impl.createDocument();
  return Fleur.DOMParser._appendFromJSON(doc, o);
};
Fleur.DOMParser._appendFromString = function(node, s, mediatype, grammar) {
  var media = mediatype.split(";"), config = {}, param, paramreg = /^\s*(\S*)\s*=\s*(\S*)\s*$/, i = 1, l = media.length, handler;
  while (i < l) {
    param = paramreg.exec(media[i]);
    config[param[1]] = param[2];
    i++;
  }
  var mime = media[0].replace(/^\s+|\s+$/gm,'');
  if (mime.endsWith("+xml") && mime !== "application/exml+xml") {
    mime = "application/xml";
  }
  handler = Fleur.DOMParser.Handlers[mime];
  if (!handler) {
    return;
  }
  handler(node, s, config, grammar);
  return node;
};

Fleur.OFXtags = [
  "ACCTID",
  "ACCTTYPE",
  "BALAMT",
  "BANKID",
  "BRANCHID",
  "CODE",
  "CURDEF",
  "DTASOF",
  "DTEND",
  "DTPOSTED",
  "DTSERVER",
  "DTSTART",
  "FITID",
  "LANGUAGE",
  "MEMO",
  "NAME",
  "SEVERITY",
  "TRNAMT",
  "TRNTYPE",
  "TRNUID"
];

Fleur.DOMParser.Handlers = {
  "text/csv": function(node, s, config) {
    Fleur.DOMParser._appendFromCSVString(node, s, config);
  },
  "application/xquery": function(node, s) {
    Fleur.DOMParser.xpatharr = Fleur.XPathEvaluator._xp2js(s, "", "");
    eval("Fleur.DOMParser.xpatharr = [Fleur.XQueryX.module,[[Fleur.XQueryX.mainModule,[[Fleur.XQueryX.queryBody,[" + Fleur.DOMParser.xpatharr + ']]]],[Fleur.XQueryX.xqx,["http://www.w3.org/2005/XQueryX"]]]];');
    Fleur.DOMParser._appendFromArray(node, Fleur.XQueryXNames, [Fleur.DOMParser.xpatharr]);
    delete Fleur.DOMParser.xpatharr;
  },
  "application/json": function(node, s) {
    try {
      eval("Fleur.DOMParser.json = " + s);
      Fleur.DOMParser._appendFromJSON(node, Fleur.DOMParser.json);
      delete Fleur.DOMParser.json;
    } catch (e) {}
  },
  "application/xml": function(node, s) {
    Fleur.DOMParser._appendFromXMLString(node, s);
  },
  "application/x-ofx": function(node, s) {
    if (s.startsWith("OFXHEADER:")) {
      var propertyname = "", propertyvalue = "", text ="", offset = 0, end = s.length, c, state = 0, doc = node.ownerDocument || node;
      c = s.charAt(offset);
      while (c !== "<" && offset !== end) {
        if (state === 0) {
          if (c === ":") {
            state = 1;
          } else {
            propertyname += c;
          }
        } else {
          if (c === "\n") {
            text += (text !== "" ? " " : "") + propertyname + "=\"" + propertyvalue + "\"";
            state = 0;
            propertyname = "";
            propertyvalue = "";
          } else if (c !== "\r") {
            propertyvalue += c;
          }
        }
        c = s.charAt(++offset);
      }
      node.appendChild(doc.createProcessingInstruction("OFX", text));
      Fleur.DOMParser._appendFromXMLString(node, s.substr(offset), Fleur.OFXtags);
    } else {
      Fleur.DOMParser._appendFromXMLString(node, s);
    }
  },
  "application/exml+xml": function(node, s) {
    var enode = node.ownerDocument.implementation.createDocument();
    Fleur.DOMParser._appendFromXMLString(enode, s);
    Fleur.DOMParser._appendFromEXML(node, enode.documentElement);
    enode.removeChild(enode.documentElement);
    enode = null;
  },
  "application/zip": function(node, s) {
    Fleur.DOMParser._appendFromZIP(node, s);
  },
  "text/markdown": function(node, s) {
    Fleur.DOMParser._appendFromMD(node, s);
  },
  "text/plain":  function(node, s, config, grammar) {
    if (grammar) {
      Fleur.DOMParser._appendFromGrammarString(node, s, grammar);
    } else {
      var t = new Fleur.Text();
      t.data = s;
      node.appendChild(t);
    }
  }
};
Fleur.DOMParser.Handlers["text/xml"] = Fleur.DOMParser.Handlers["application/xml"];
Fleur.DOMParser.Handlers["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = Fleur.DOMParser.Handlers["application/zip"];
Fleur.DOMParser.Handlers["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] = Fleur.DOMParser.Handlers["application/zip"];
Fleur.DOMParser.Handlers["text/json"] = Fleur.DOMParser.Handlers["application/json"];

Fleur.DOMParser.prototype.parseFromString = function(s, mediatype, grammar) {
  if (mediatype.startsWith("text/csv")) {
    var seq = new Fleur.Sequence();
    return Fleur.DOMParser._appendFromString(seq, s, mediatype, grammar);
  }
  var doc, impl, domSource = new Fleur.DOMImplementationSource();
  impl = domSource.getDOMImplementation("XML");
  doc = impl.createDocument();
  return Fleur.DOMParser._appendFromString(doc, s, mediatype, grammar);
};