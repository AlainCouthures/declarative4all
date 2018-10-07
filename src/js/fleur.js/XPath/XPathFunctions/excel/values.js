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
		return Fleur.XPathFunctions_excel["values#4"].jsfunc(book, null, false, false);
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});

Fleur.XPathFunctions_excel["values#2"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book, range) {
		return Fleur.XPathFunctions_excel["values#4"].jsfunc(book, range, false, false);
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node});

Fleur.XPathFunctions_excel["values#3"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book, range, rheader) {
		return Fleur.XPathFunctions_excel["values#4"].jsfunc(book, range, rheader, false);
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_boolean, occurence: "?"}], false, false, {type: Fleur.Node});

Fleur.XPathFunctions_excel["values#4"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book, range, rheader, cheader) {
		var i, l, n;
		if (book === null) {
			return Fleur.EmptySequence;
		}
		var sheetname, sheetrid, sheetfname;
		range = range || "";
		rheader = rheader || false;
		cheader = cheader || false;
		if (range.indexOf("!") !== -1) {
			sheetname = range.substr(0, range.indexOf("!"));
			range = range.substr(range.indexOf("!") + 1);
		}
		var shs = book.firstChild.getEntryNode("xl/sharedStrings.xml");
		var shsdoc;
		var sharedstrings = [];
		if (shs) {
			shs = shs.firstChild;
			if (!shs.hasEntry("doc")) {
				shsdoc = book.createEntry("doc");
				Fleur.DOMParser._appendFromXMLString(shsdoc, Fleur.bin2utf8(Fleur.inflate(shs.getEntryNode("compressedFileData").textContent)));
				shs.setEntryNode(shsdoc);
			} else {
				shsdoc = shs.getEntryNode("doc");
			}
			n = shsdoc.firstChild;
			while (n !== null && n.nodeType !== Fleur.Node.ELEMENT_NODE) {
				n = n.nextSibling;
			}
			n = n.firstChild;
			while (n !== null) {
				if (n.localName === "si") {
					sharedstrings.push(n.children[0].textContent);
				}
				n = n.nextSibling;
			}
		}
		var wb = book.firstChild.getEntryNode("xl/workbook.xml").firstChild;
		var wbdoc;
		if (!wb.hasEntry("doc")) {
			wbdoc = book.createEntry("doc");
			Fleur.DOMParser._appendFromXMLString(wbdoc, Fleur.bin2utf8(Fleur.inflate(wb.getEntryNode("compressedFileData").textContent)));
			wb.setEntryNode(wbdoc);
		} else {
			wbdoc = wb.getEntryNode("doc");
		}
		n = wbdoc.firstChild;
		while (n !== null && n.nodeType !== Fleur.Node.ELEMENT_NODE) {
			n = n.nextSibling;
		}
		n = n.firstChild;
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
			var wbrels = book.firstChild.getEntryNode("xl/_rels/workbook.xml.rels").firstChild;
			var wbrelsdoc;
			if (!wbrels.hasEntry("doc")) {
				wbrelsdoc = book.createEntry("doc");
				Fleur.DOMParser._appendFromXMLString(wbrelsdoc, Fleur.bin2utf8(Fleur.inflate(wbrels.getEntryNode("compressedFileData").textContent)));
				wbrels.setEntryNode(wbrelsdoc);
			} else {
				wbrelsdoc = wbrels.getEntryNode("doc");
			}
			n = wbrelsdoc.firstChild;
			while (n !== null && n.nodeType !== Fleur.Node.ELEMENT_NODE) {
				n = n.nextSibling;
			}
			n = n.firstChild;
			while (n !== null && n.getAttribute("Id") !== sheetrid) {
				n = n.nextSibling;
			}
			if (n !== null) {
				sheetfname = "xl/" + n.getAttribute("Target");
				var sheetdoc, sheet = book.firstChild.getEntryNode(sheetfname).firstChild;
				if (!sheet.hasEntry("doc")) {
					sheetdoc = book.createEntry("doc");
					Fleur.DOMParser._appendFromXMLString(sheetdoc, Fleur.bin2utf8(Fleur.inflate(sheet.getEntryNode("compressedFileData").textContent)));
					sheet.setEntryNode(sheetdoc);
				} else {
					sheetdoc = sheet.getEntryNode("doc");
				}
				n = sheetdoc.firstChild;
				while (n !== null && n.nodeType !== Fleur.Node.ELEMENT_NODE) {
					n = n.nextSibling;
				}
				n = n.firstChild;
				if (n.localName === "dimension") {
					range = n.getAttribute("ref");
				}
				var maxrow = 0;
				var maxcolumn = 0;
				var cell = function(s, defrow, defcolumn) {
					s = s.toUpperCase();
					var ii = 0, ll = s.length, row = 0, column = 0, c = s.charCodeAt(ii);
					while (ii < ll && c >= 65 && c <= 90) {
						column = column * 26 + c - 64;
						c = s.charCodeAt(++ii);
					}
					if (ii === 0) {
						column = defcolumn;
					} else {
						column--;
					}
					if (ii === ll) {
						row = defrow;
					} else {
						while (ii < ll && c >= 48 && c <= 57) {
							row = row * 10 + c - 48;
							c = s.charCodeAt(++ii);
						}
						row--;
					}
					return {row: row, column: column};
				};
				var cells = [];
				while (n !== null && n.localName !== "sheetData") {
					n = n.nextSibling;
				}
				if (n.localName === "sheetData") {
					n = n.firstChild;
					while (n !== null) {
						if (n.localName === "row") {
							var n2 = n.firstChild;
							while (n2 !== null) {
								if (n2.localName === "c") {
									var cref = cell(n2.getAttribute("r"));
									var ctype = n2.getAttribute("t");
									if (n2.children[0]) {
										var cvalue = n2.children[0].textContent;
										if (ctype === "s") {
											cvalue = sharedstrings[parseInt(cvalue, 10)];
										} else if (cvalue.indexOf(".0") !== -1) {
											cvalue = cvalue.substr(0, cvalue.indexOf(".0"));
										}
										if (!cells[cref.row]) {
											cells[cref.row] = [];
										}
										cells[cref.row][cref.column] = cvalue;
										maxrow = Math.max(maxrow, cref.row);
										maxcolumn = Math.max(maxcolumn, cref.column);
									}
								}
								n2 = n2.nextSibling;
							}
						}
						n = n.nextSibling;
					}
				}
				var firstcell, lastcell;
				if (range.indexOf(":") !== -1) {
					range = range.split(":");
					firstcell = cell(range[0], 0, 0);
					lastcell = cell(range[1], maxrow, maxcolumn);
				} else {
					firstcell = cell(range, 0, 0);
					lastcell = cell(range, maxrow, maxcolumn);
				}
				var seq = new Fleur.Sequence();
				if (rheader) {
					seq.rowlabels = [];
					for (var r = cheader ? firstcell.row + 1 : firstcell.row; r <= lastcell.row; r++) {
						seq.rowlabels.push(cells[r][firstcell.column]);
					}
					firstcell.column++;
				}
				if (cheader) {
					seq.collabels = cells[firstcell.row].slice(firstcell.column, lastcell.column + 1);
					firstcell.row++;
				}
				for (var currow = firstcell.row; currow <= lastcell.row; currow++) {
					var m;
					if (firstcell.row !== lastcell.row) {
						m = new Fleur.Multidim();
					} else {
						m = seq;
					}
					for (var curcol = firstcell.column; curcol <= lastcell.column; curcol++) {
						var a = new Fleur.Text();
						a.data = cells[currow] ? cells[currow][curcol] || "" : "";
						a.schemaTypeInfo = Fleur.Type_string;
						m.appendChild(a);
					}
					if (m !== seq) {
						seq.appendChild(m);
					}
				}
				return seq;
			}
		}
		return Fleur.EmptySequence;
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_boolean, occurence: "?"}, {type: Fleur.Type_boolean, occurence: "?"}], false, false, {type: Fleur.Node});
