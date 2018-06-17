/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_excel["values#1"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book) {
		return Fleur.XPathFunctions_excel["values#4"].jsfunc(book, null, null, null);
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});

Fleur.XPathFunctions_excel["values#2"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book, range) {
		return Fleur.XPathFunctions_excel["values#4"].jsfunc(book, range, null, null);
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node});

Fleur.XPathFunctions_excel["values#3"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book, range, rheader) {
		return Fleur.XPathFunctions_excel["values#4"].jsfunc(book, range, rheader, null);
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node});

Fleur.XPathFunctions_excel["values#4"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book, range, rheader, cheader) {
		var parser = new Fleur.DOMParser();
		var i, l;
		if (book === null) {
			return Fleur.EmptySequence;
		}
		var sheetname, sheetrid, sheetfname;
		if (range.contains("!")) {
			sheetname = range.substr(0, range.indexOf("!"));
			range = range.substr(range.indexOf("!") + 1);
		}
		var wb = book.getEntryNode("xl/workbook.xml");
		var wbdoc;
		if (!wb.hasEntry("doc")) {
			wbdoc = new Fleur.Entry();
			wbdoc.nodeName = "doc";
			wbdoc.namespaceURI = null;
			wbdoc.localName = "doc";
			wbdoc.appendChild(parser.parseFromString(wb.getEntryNode("compressedFileData").textContent, "application/xml"));
			wb.setEntryNode(wbdoc);
		} else {
			wbdoc = wb.getEntryNode("doc");
		}
		var n = wbdoc.documentElement.firstChild;
		while (n !== null && n.localName !== "sheets") {
			n = n.nextSibling;
		}
		if (!sheetname) {
			sheetrid = n.children[0].getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
		} else {
			for (i = 0, l = n.children.length; i < l; i++) {
				if (n.children[i].getAttribute("name") === sheetname) {
					sheetrid = n.children[i].getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
					break;
				}
			}
		}
		if (sheetrid) {
			var wbrels = book.getEntryNode("xl/_rels/workbook.xml.rels");
			var wbrelsdoc;
			if (!wbrels.hasEntry("doc")) {
				wbrelsdoc = new Fleur.Entry();
				wbrelsdoc.nodeName = "doc";
				wbrelsdoc.namespaceURI = null;
				wbrelsdoc.localName = "doc";
				wbrelsdoc.appendChild(parser.parseFromString(wbrels.getEntryNode("compressedFileData").textContent, "application/xml"));
				wbrels.setEntryNode(wbrelsdoc);
			} else {
				wbrelsdoc = wbrels.getEntryNode("doc");
			}
			n = wbrelsdoc.documentElement.firstChild;
			while (n !== null && n.getAttribute("Id") !== sheetrid) {
				n = n.nextSibling;
			}
			if (n !== null) {
				sheetfname = "xl/" + n.getAttribute("Target");
				var dimension, sheetdoc, sheet = book.getEntryNode(sheetfname);
				if (!sheet.hasEntry("doc")) {
					sheetdoc = new Fleur.Entry();
					sheetdoc.nodeName = "doc";
					sheetdoc.namespaceURI = null;
					sheetdoc.localName = "doc";
					sheetdoc.appendChild(parser.parseFromString(sheet.getEntryNode("compressedFileData").textContent, "application/xml"));
					sheet.setEntryNode(sheetdoc);
				} else {
					sheetdoc = sheet.getEntryNode("doc");
				}
				n = sheetdoc.documentElement.firstChild;
				if (n.localName === "dimension") {
					dimension = n.getAttribute("ref");
				}
				if (!range) {
					range = dimension;
				}
				var cell = function(s) {
					var i = 0, l = s.length, row = 0, column = 0, c = s.charAt(i).toUpperCase();
					while (i < l && c >= 65 && c <= 90) {
						column = column * 26 + c - 65;
						c = s.charAt(++i).toUpperCase();
					}
					column++;
					while (i < l && c >= 48 && c <= 57) {
						row = row * 10 + c - 48;
						c = s.charAt(++i).toUpperCase();
					}
					return {row: row, column: column};
				};
				var cellref;
				var firstcell, lastcell;
				if (range.contains(":")) {
					range = range.split(":");
					firstcell = cell(range[0]);
					lastcell = cell(range[1]);
				} else {
					firstcell = cell(range);
					lastcell = cell(range);
				}
				
			}
		}
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node});
