import { resolveEntities } from './resolveEntities.js';

function formatErrorMessage(message, offset, s) {
  const line = s.substring(0, offset).split('\n').length;
  const column = offset - s.lastIndexOf('\n', offset - 1) + 1;
  return `Error: ${message} at line ${line}, column ${column}`;
}

function isValidXMLAttributeName(name) {
  if (typeof name !== 'string' || !name) {
    return false;
  }
  const colonIndex = name.indexOf(':');
  if (colonIndex !== -1) {
    if (colonIndex === 0 || colonIndex === name.length - 1 || name.indexOf(':', colonIndex + 1) !== -1) {
      return false;
    }
    const prefix = name.substring(0, colonIndex);
    const local = name.substring(colonIndex + 1);
    return isValidXMLAttributeName(prefix) && isValidXMLAttributeName(local);
  }
  const isStart = cp => (
    (cp >= 0x41 && cp <= 0x5A) || cp === 0x5F || (cp >= 0x61 && cp <= 0x7A) ||
    (cp >= 0xC0 && cp <= 0xD6) || (cp >= 0xD8 && cp <= 0xF6) || (cp >= 0xF8 && cp <= 0x2FF) ||
    (cp >= 0x370 && cp <= 0x37D) || (cp >= 0x37F && cp <= 0x1FFF) || (cp >= 0x200C && cp <= 0x200D) ||
    (cp >= 0x2070 && cp <= 0x218F) || (cp >= 0x2C00 && cp <= 0x2FEF) || (cp >= 0x3001 && cp <= 0xD7FF) ||
    (cp >= 0xF900 && cp <= 0xFDCF) || (cp >= 0xFDF0 && cp <= 0xFFFD) || (cp >= 0x10000 && cp <= 0xEFFFF)
  );
  const isChar = cp => (
    isStart(cp) || cp === 0x2D || cp === 0x2E || (cp >= 0x30 && cp <= 0x39) ||
    cp === 0xB7 || (cp >= 0x0300 && cp <= 0x036F) || (cp >= 0x203F && cp <= 0x2040)
  );
  let i = 0, cp = name.codePointAt(i);
  if (!isStart(cp)) {
    return false;
  }
  i += cp > 0xFFFF ? 2 : 1;
  while (i < name.length) {
    cp = name.codePointAt(i);
    if (!isChar(cp)) {
      return false;
    }
    i += cp > 0xFFFF ? 2 : 1;
  }
  return true;
}

function isValidXMLElementName(name) {
  return isValidXMLAttributeName(name) && !/^[Xx][Mm][Ll]/.test(name);
}

export const XML_MODE = 0;
export const HTML_MODE = 1;

export function loadFromString(node, s, mode, leaftags) {
  mode = mode ?? XML_MODE;
  var ii, ll, text, entstart, entityname, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrs, parents = [], doc = node.ownerDocument || node, currnode = node, currnodeName, eltnode, c,
    seps_pi = ' \t\n\r?', seps_dtd = ' \t\n\r[>', seps_close = ' \t\n\r>', seps_elt = ' \t\n\r/>', seps_attr = ' \t\n\r=/<>\'"', seps = ' \t\n\r',
    n, namespaces = {'xmlns': 'http://www.w3.org/2000/xmlns/', 'xml': 'http://www.w3.org/XML/1998/namespace'}, newnamespaces = {}, pindex, prefix, localName, dtdtype, dtdpublicid, dtdsystemid, entityvalue, notationvalue, uri;
  while (offset !== end) {
    text = '';
    c = s.charAt(offset);
    while (c !== '<' && offset !== end) {
      if (c === '&') {
        c = s.charAt(++offset);
        entstart = offset;
        entityname = '';
        while (c !== ';' && offset !== end) {
          entityname += c;
          c = s.charAt(++offset);
        }
        if (offset === end) {
          break;
        }
        entityvalue = '';
        switch (entityname) {
          case 'amp':
            text += '&';
            break;
          case 'lt':
            text += '<';
            break;
          case 'gt':
            text += '>';
            break;
          case 'apos':
            text += "'";
            break;
          case 'quot':
            text += '"';
            break;
          default:
            if (entityname.charAt(0) === '#') {
              text += String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? '0' + entityname.substring(1).toLowerCase() : entityname.substring(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
            } else if (doc.doctype) {
              entityvalue = doc.doctype.getEntity(entityname);
              s = s.substring(0, entstart - 1) + entityvalue + s.substring(offset + 1);
              offset = entstart - 2;
              end = s.length;
            }
        }
      } else {
        text += c;
      }
      c = s.charAt(++offset);
    }
    if (text.trim() !== '') {
      currnode.appendChild(doc.createTextNode(text.trim()));
    }
    if (offset === end) {
      break;
    }
    if (leaftags && leaftags.indexOf(currnodeName) !== -1) {
      if (currnode.firstChild.data.endsWith('\r\n')) {
        currnode.firstChild.data = currnode.firstChild.data.substring(0, currnode.firstChild.data.length - 2);
      }
      n = parents.pop();
      namespaces = {};
      for (prefix in n.namespaces) {
        if (Object.prototype.hasOwnProperty.call(n.namespaces, prefix)) {
          namespaces[prefix] = n.namespaces[prefix];
        }
      }
      currnode = n.node;
      currnodeName = n.nodeName;
    }
    offset++;
    if (s.charAt(offset) === '!') {
      offset++;
      if (s.substr(offset, 2) === '--') {
        offset += 2;
        index = s.indexOf('-->', offset);
        if (index !== offset) {
          if (index === -1) {
            index = end;
          }
          text = '';
          ii = offset;
          while (ii < index) {
            text += s.charAt(ii++);
          }
          currnode.appendChild(doc.createComment(text));
          if (index === end) {
            break;
          }
          offset = index;
        }
        offset += 3;
      } else if (s.substr(offset, 7) === '[CDATA[') {
        offset += 7;
        index = s.indexOf(']]>', offset);
        if (index !== offset) {
          if (index === -1) {
            index = end;
          }
          text = '';
          ii = offset;
          while (ii < index) {
            text += s.charAt(ii++);
          }
          currnode.appendChild(doc.createCDATASection(text));
          if (index === end) {
            break;
          }
          offset = index;
        }
        offset += 3;
      } else if (s.substr(offset, 7) === 'DOCTYPE') {
        offset += 7;
        index = s.indexOf('>', offset);
        while (seps.indexOf(c) !== -1) {
          c = s.charAt(offset++);
        }
        nodename = '';
        while (seps_dtd.indexOf(c) === -1 && offset !== end) {
          nodename += c;
          c = s.charAt(offset++);
        }
        while (seps.indexOf(c) !== -1) {
          c = s.charAt(offset++);
        }
        dtdtype = '';
        while (seps_dtd.indexOf(c) === -1 && offset !== end) {
          dtdtype += c;
          c = s.charAt(offset++);
        }
        if (dtdtype === 'PUBLIC' || dtdtype === 'SYSTEM') {
          if (dtdtype === 'PUBLIC') {
            while (seps.indexOf(c) !== -1) {
              c = s.charAt(offset++);
            }
            dtdpublicid = '';
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
          dtdsystemid = '';
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
        if (doc.implementation) {
          currnode.appendChild(doc.doctype = doc.implementation.createDocumentType(nodename, dtdpublicid, dtdsystemid));
          doc.doctype.ownerDocument = doc;
        }
        if (c === '[') {
          index = s.indexOf(']', offset);
          c = s.charAt(offset++);
          while (c !== ']' && offset < end) {
            while (seps.indexOf(c) !== -1) {
              c = s.charAt(offset++);
            }
            if (c === ']') {
              break;
            }
            if (s.substr(offset, 7) === '!ENTITY') {
              offset += 7;
              c = s.charAt(offset++);
              while (seps.indexOf(c) !== -1) {
                c = s.charAt(offset++);
              }
              if (c === '%') {
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              }
              nodename = '';
              while (seps_dtd.indexOf(c) === -1) {
                nodename += c;
                c = s.charAt(offset++);
              }
              while (seps.indexOf(c) !== -1) {
                c = s.charAt(offset++);
              }
              if (s.substr(offset - 1, 6) === 'SYSTEM') {
                offset += 5;
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              } else if (s.substr(offset -1, 6) === 'PUBLIC') {
                offset += 5;
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
                while (seps_dtd.indexOf(c) === -1 && offset !== end) {
                  c = s.charAt(offset++);
                }
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              }
              entityvalue = '';
              ii = offset;
              ll = Math.min(index - 1, s.indexOf(c, offset));
              while (ii < ll) {
                entityvalue += s.charAt(ii++);
              }
              offset += entityvalue.length + 1;
              c = s.charAt(offset++);
              doc.doctype.setEntity(nodename, entityvalue);
            } else if (s.substr(offset, 9) === '!NOTATION') {
              offset += 9;
              c = s.charAt(offset++);
              while (seps.indexOf(c) !== -1) {
                c = s.charAt(offset++);
              }
              nodename = '';
              while (seps_dtd.indexOf(c) === -1 && offset !== end) {
                nodename += c;
                c = s.charAt(offset++);
              }
              while (seps.indexOf(c) !== -1) {
                c = s.charAt(offset++);
              }
              if (s.substr(offset - 1, 6) === 'SYSTEM') {
                offset += 5;
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              } else if (s.substr(offset -1, 6) === 'PUBLIC') {
                offset += 5;
                c = s.charAt(offset++);
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
                while (seps_dtd.indexOf(c) === -1 && offset !== end) {
                  c = s.charAt(offset++);
                }
                while (seps.indexOf(c) !== -1) {
                  c = s.charAt(offset++);
                }
              }
              if (c === '"' || c === "'") {
                notationvalue = '';
                ii = offset;
                ll = Math.min(index - 1, s.indexOf(c, offset));
                while (ii < ll) {
                  notationvalue += s.charAt(ii++);
                }
                offset += notationvalue.length + 1;
                c = s.charAt(offset++);
              }
            }
            offset = s.indexOf('>', offset - 1) + 1;
            c = s.charAt(offset++);
          }
          index = s.indexOf('>', offset);
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
    } else if (s.charAt(offset) === '?') {
      offset++;
      c = s.charAt(offset++);
      nodename = '';
      while (seps_pi.indexOf(c) === -1 && offset !== end) {
        nodename += c;
        c = s.charAt(offset++);
      }
      index = s.indexOf('?>', offset - 1);
      if (index === -1) {
        index = end;
      }
      if (nodename === 'xml') {
        if (offset != 6) {
          throw new Error(formatErrorMessage('Invalid position for XML declaration', offset - 7, s));
        }
        if (s.charCodeAt(index + 2) === 13) {
          index++;
        }
        if (s.charCodeAt(index + 2) === 10) {
          index++;
        }
      } else if (nodename !== '') {
        text = '';
        ii = offset;
        while (ii < index) {
          text += s.charAt(ii++);
        }
        currnode.appendChild(doc.createProcessingInstruction(nodename, index === offset - 1 ? '' : text));
      }
      if (index === end) {
        break;
      }
      offset = index + 2;
    } else if (s.charAt(offset) === '/') {
      offset++;
      c = s.charAt(offset++);
      nodename = '';
      while (seps_close.indexOf(c) === -1 && offset !== end) {
        nodename += c;
        c = s.charAt(offset++);
      }
      if (!isValidXMLElementName(nodename)) {
        throw new Error(formatErrorMessage('Invalid XML element name', offset - 2 - nodename.length, s));
      }
      if (nodename === currnodeName) {
        n = parents.pop();
        namespaces = {};
        for (prefix in n.namespaces) {
          if (Object.prototype.hasOwnProperty.call(n.namespaces, prefix)) {
            namespaces[prefix] = n.namespaces[prefix];
          }
        }
        currnode = n.node;
        currnodeName = n.nodeName;
      } else {
        if (mode === XML_MODE) {
          throw new Error(formatErrorMessage('Not well-formed XML', offset - 2 - nodename.length, s));
        }
        while (parents.length !== 0) {
          n = parents.pop();
          if (nodename === n.node.nodeName) {
            namespaces = {};
            for (prefix in n.namespaces) {
              if (Object.prototype.hasOwnProperty.call(n.namespaces, prefix)) {
                namespaces[prefix] = n.namespaces[prefix];
              }
            }
            currnode = n.node;
            currnodeName = n.nodeName;
            break;
          }
        }
      }
      offset = s.indexOf('>', offset - 1) + 1;
      if (offset === 0) {
        break;
      }
    } else {
      c = s.charAt(offset++);
      nodename = '';
      while (seps_elt.indexOf(c) === -1 && offset !== end) {
        nodename += c;
        c = s.charAt(offset++);
      }
      index = s.indexOf('>', offset - 1);
      if (nodename !== '') {
        if (!isValidXMLElementName(nodename)) {
          throw new Error(formatErrorMessage('Invalid XML element name', offset - 2 - nodename.length, s));
        }
        newnamespaces = {};
        for (prefix in namespaces) {
          if (Object.prototype.hasOwnProperty.call(namespaces, prefix)) {
            newnamespaces[prefix] = namespaces[prefix];
          }
        }
        attrs = {};
        while (offset !== end) {
          while (seps.indexOf(c) !== -1) {
            c = s.charAt(offset++);
          }
          if (seps_attr.indexOf(c) !== -1 || offset === end) {
            break;
          }
          attrname = '';
          while (seps_attr.indexOf(c) === -1 && offset !== end) {
            attrname += c;
            c = s.charAt(offset++);
          }
          if (attrname !== '') {
            if (attrname !== 'xmlns' && !isValidXMLAttributeName(attrname)) {
              throw new Error(formatErrorMessage('Invalid XML attribute name', offset - 2 - attrname.length, s));
            }
            while (seps.indexOf(c) !== -1 && offset !== end) {
              c = s.charAt(offset++);
            }
            if (c === '=') {
              c = s.charAt(offset++);
              while (seps.indexOf(c) !== -1 && offset !== end) {
                c = s.charAt(offset++);
              }
              attrvalue = '';
              if (c === "'" || c === '"') {
                attrvalue = '';
                ii = offset;
                const attrend = s.indexOf(c, offset);
                if (attrend !== -1) {
                  ll = Math.min(index - 1, attrend);
                  while (ii < ll) {
                    attrvalue += s.charAt(ii++);
                  }
                  offset += attrvalue.length + 1;
                  c = s.charAt(offset++);
                } else {
                  offset = end;
                }
              } else {
                while (seps_elt.indexOf(c) === -1 && offset !== end) {
                  attrvalue += c;
                  c = s.charAt(offset++);
                }
              }
            } else {
              attrvalue = attrname;
            }
            pindex = attrname.indexOf(':');
            prefix = pindex !== -1 ? attrname.substring(0, pindex) : '';
            localName = pindex !== -1 ? attrname.substring(pindex + 1) : attrname;
            if (prefix === 'xmlns') {
              newnamespaces[localName] = attrvalue;
            } else if (prefix === '' && localName === 'xmlns') {
              newnamespaces[''] = attrvalue;
            }
            if (!attrs[prefix]) {
              attrs[prefix] = {};
            }
            attrs[prefix][localName] = attrvalue;
          }
        }
        pindex = nodename.indexOf(':');
        uri = newnamespaces[pindex !== -1 ? nodename.substring(0, pindex) : ''];
        eltnode = doc.createElementNS(uri, nodename);
        if (doc._elementsByTagName) {
          if (!doc._elementsByTagName[uri]) {
            doc._elementsByTagName[uri] = {};
            doc._elementsByTagName[uri][nodename] = [eltnode];
          } else if (!doc._elementsByTagName[uri][nodename]) {
            doc._elementsByTagName[uri][nodename] = [eltnode];
          } else {
            doc._elementsByTagName[uri][nodename].push(eltnode);
          }
        }
        for (prefix in attrs) {
          if (Object.prototype.hasOwnProperty.call(attrs, prefix)) {
            if (prefix !== '' && !(prefix in newnamespaces)) {
              throw new Error(formatErrorMessage(`Prefix '${prefix}' not declared`, offset - 2 - attrname.length, s));
            }
            for (attrname in attrs[prefix]) {
              if (Object.prototype.hasOwnProperty.call(attrs[prefix], attrname)) {
                attrvalue = resolveEntities(doc.doctype, attrs[prefix][attrname]);
                if (doc._elementById && attrname === 'id' && (prefix === '' || prefix === 'xml')) {
                  doc._elementById[attrvalue] = eltnode;
                }
                eltnode.setAttributeNS(prefix !== '' ? newnamespaces[prefix] : attrname === 'xmlns' ? 'http://www.w3.org/2000/xmlns/' : null, prefix !== '' ? prefix + ':' + attrname : attrname, attrvalue);
              }
            }
          }
        }
        currnode.appendChild(eltnode);
        if (s.charAt(offset - 1) !== '/') {
          parents.push({node: currnode, nodeName: currnodeName, namespaces: namespaces});
          currnode = eltnode;
          currnodeName = nodename;
          namespaces = {};
          for (prefix in newnamespaces) {
            if (Object.prototype.hasOwnProperty.call(newnamespaces, prefix)) {
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
  if (parents.length !== 0 && (mode === XML_MODE)) {
    throw new Error(formatErrorMessage('Not well-formed XML', offset - 2 - nodename.length, s));
  }
}