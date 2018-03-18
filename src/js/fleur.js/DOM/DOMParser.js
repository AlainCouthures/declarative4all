/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.DOMParser = function() {};
Fleur.DOMParser._appendFromCSVString = function(node, s, config) {
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
/*
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
Fleur.DOMParser._appendFromXMLString = function(node, s) {
	var ii, ll, text, entstart, entityname, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrs, parents = [], doc = node.ownerDocument || node, currnode = node, eltnode, attrnode, c,
		seps_pi = " \t\n\r?", seps_dtd = " \t\n\r[>", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r",
		n, namespaces = {}, newnamespaces = {}, pindex, prefix, localName, dtdtype, dtdpublicid, dtdsystemid, entityvalue, notationvalue;
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
Fleur.DOMParser._appendFromArray = function(node, names, os) {
	var i, l, o, n, nodename, doc = node.ownerDocument || node;
	for (i = 0, l = os.length; i < l; i++) {
		o = os[i];
		if (typeof o === "string") {
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
Fleur.DOMParser.Handlers = {
	"text/csv": function(node, s, config) {
		Fleur.DOMParser._appendFromCSVString(node, s, config);
	},
	/**
	 * @callback
	 */
	"application/xquery": function(node, s, config) {
		Fleur.DOMParser.xpatharr = Fleur.XPathEvaluator._xp2js(s, "", "");
		eval("Fleur.DOMParser.xpatharr = [Fleur.XQueryX.module,[[Fleur.XQueryX.mainModule,[[Fleur.XQueryX.queryBody,[" + Fleur.DOMParser.xpatharr + ']]]],[Fleur.XQueryX.xqx,["http://www.w3.org/2005/XQueryX"]]]];');
		Fleur.DOMParser._appendFromArray(node, Fleur.XQueryXNames, [Fleur.DOMParser.xpatharr]);
		delete Fleur.DOMParser.xpatharr;
	},
	/**
	 * @callback
	 */
	"application/json": function(node, s, config) {
		try {
			eval("Fleur.DOMParser.json = " + s);
			Fleur.DOMParser._appendFromJSON(node, Fleur.DOMParser.json);
			delete Fleur.DOMParser.json;
		} catch (e) {}
	},
	/**
	 * @callback
	 */
	"application/xml": function(node, s, config) {
		Fleur.DOMParser._appendFromXMLString(node, s);
	},
	/**
	 * @callback
	 */
	"application/exml+xml": function(node, s, config) {
		var enode = node.ownerDocument.implementation.createDocument();
		Fleur.DOMParser._appendFromXMLString(enode, s);
		Fleur.DOMParser._appendFromEXML(node, enode.documentElement);
		enode.removeChild(enode.documentElement);
		enode = null;
	},
	/**
	 * @callback
	 */
	"text/plain":  function(node, s, config, grammar) {
		Fleur.DOMParser._appendFromGrammarString(node, s, grammar);
	}
};
Fleur.DOMParser.Handlers["text/xml"] = Fleur.DOMParser.Handlers["application/xml"];
Fleur.DOMParser.Handlers["text/json"] = Fleur.DOMParser.Handlers["application/json"];

Fleur.DOMParser.prototype.parseFromString = function(s, mediatype, grammar) {
	var doc, impl, domSource = new Fleur.DOMImplementationSource();
	impl = domSource.getDOMImplementation("XML");
	doc = impl.createDocument();
	return Fleur.DOMParser._appendFromString(doc, s, mediatype, grammar);
};