/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Serializer = function() {};
Fleur.Serializer.escapeXML = function(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
Fleur.Serializer._serializeXMLToString = function(node, indent, offset) {
	var s, i, l;
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
					s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i])).replace(/\"/g, "&quot;") + "\"";
				}
			} else {
				for (i = 0, l = node.attributes.length; i < l; i++) {
					s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue).replace(/\"/g, "&quot;") + "\"";
				}
			}
			if (node.childNodes.length === 0) {
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset + "  ");
			}
			return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName + (indent ? ">\n" : ">");
		case Fleur.Node.TEXT_NODE:
			if (indent && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
				return "";
			}
			return Fleur.Serializer.escapeXML(node.data);
		case Fleur.Node.CDATA_NODE:
			return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.nodeValue + (indent ? "?>\n" : "?>");
		case Fleur.Node.COMMENT_NODE:
			return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
		case Fleur.Node.DOCUMENT_NODE:
			s = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset);
			}
			return s;
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
				s += " name=\"" + Fleur.Serializer.escapeXML(node.nodeName).replace('"', "&quot;") + "\"";
			}
			if (node.attributes) {
				if (indent) {
					var names = [];
					for (i = 0, l = node.attributes.length; i < l; i++) {
						names.push(node.attributes[i].nodeName);
					}
					names.sort();
					for (i = 0, l = names.length; i < l; i++) {
						s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i])).replace('"', "&quot;") + "\"";
					}
				} else {
					for (i = 0, l = node.attributes.length; i < l; i++) {
						s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue).replace('"', "&quot;") + "\"";
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
			return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.nodeValue + (indent ? "?>\n" : "?>");
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
Fleur.Serializer.escapeJSON = function(s) {
	try {
		return s.replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\\/g, "\\");
	} catch (e) {
		return "";
	}
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
			quote = node.schemaTypeInfo === Fleur.Type_string ? '"' : node.schemaTypeInfo === Fleur.Type_regex ? '/' : "";
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
	} else {
		return s;
	}
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
			/*
		case "tumblingWindowClause":
    <xsl:text>   tumbling window </xsl:text>
    <xsl:apply-templates select="xqx:typedVariableBinding"/>
    <xsl:text> in </xsl:text>
    <xsl:apply-templates select="xqx:bindingSequence"/>
    <xsl:value-of select="$NEWLINE"/>
    <xsl:text>      </xsl:text>
    <xsl:apply-templates select="xqx:windowStartCondition"/>
    <xsl:value-of select="$NEWLINE"/>
    <xsl:text>      </xsl:text>
    <xsl:apply-templates select="xqx:windowEndCondition"/>
  </xsl:template>
		case "slidingWindowClause":
    <xsl:text>   sliding window </xsl:text>
    <xsl:apply-templates select="xqx:typedVariableBinding"/>
    <xsl:text> in </xsl:text>
    <xsl:apply-templates select="xqx:bindingSequence"/>
    <xsl:value-of select="$NEWLINE"/>
    <xsl:text>      </xsl:text>
    <xsl:apply-templates select="xqx:windowStartCondition"/>
    <xsl:value-of select="$NEWLINE"/>
    <xsl:text>      </xsl:text>
    <xsl:apply-templates select="xqx:windowEndCondition"/>
  </xsl:template>
  */
		case "bindingSequence":
			return Fleur.Serializer.XQX_renderChildren(node);
/*
		case "windowStartCondition":
    <xsl:text>start </xsl:text>
    <xsl:apply-templates select="xqx:windowVars"/>
    <xsl:text> when </xsl:text>
    <xsl:apply-templates select="xqx:winStartExpr"/>
  </xsl:template>
		case "windowEndCondition":
    <xsl:if test="@xqx:onlyEnd='true'">
      <xsl:text>only </xsl:text>
    </xsl:if>
    <xsl:text>end </xsl:text>
    <xsl:apply-templates select="xqx:windowVars"/>
    <xsl:text> when </xsl:text>
    <xsl:apply-templates select="xqx:winEndExpr"/>
  </xsl:template>
		case "windowVars":
    <xsl:apply-templates select="xqx:currentItem"/>
    <xsl:apply-templates select="xqx:positionalVariableBinding"/>
    <xsl:apply-templates select="xqx:previousItem"/>
    <xsl:apply-templates select="xqx:nextItem"/>
  </xsl:template>
		case "currentItem":
    <xsl:value-of select="$DOLLAR"/>
    <xsl:call-template name="renderEQName"/>
  </xsl:template>
		case "previousItem":
    <xsl:text> previous </xsl:text>
    <xsl:value-of select="$DOLLAR"/>
    <xsl:call-template name="renderEQName"/>
  </xsl:template>
		case "nextItem":
    <xsl:text> next </xsl:text>
    <xsl:value-of select="$DOLLAR"/>
    <xsl:call-template name="renderEQName"/>
  </xsl:template>
		case "countClause":
    <xsl:text> count </xsl:text>
    <xsl:apply-templates/>
    <xsl:value-of select="$NEWLINE"/>
  </xsl:template>
		case "whereClause":
    <xsl:text> where </xsl:text>
    <xsl:apply-templates select="*"/>
    <xsl:value-of select="$NEWLINE"/>
  </xsl:template>
		case "groupByClause":
    <xsl:text>  group by </xsl:text>
    <xsl:call-template name="commaSeparatedList"/>
    <xsl:value-of select="$NEWLINE"/>
  </xsl:template>
		case "groupingSpec":
    <xsl:value-of select="$DOLLAR"/>
    <xsl:apply-templates/>
  </xsl:template>
		case "groupVarInitialize":
    <xsl:if test="xqx:typeDeclaration">
      <xsl:apply-templates select="xqx:typeDeclaration"/>
    </xsl:if>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$ASSIGN"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:apply-templates select="xqx:varValue"/>
  </xsl:template>
		case "collation":
    <xsl:text> collation </xsl:text>
    <xsl:call-template name="quote">
      <xsl:with-param name="item">
        <xsl:value-of select="."/>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:template>
  */
		case "emptyOrderingMode":
		case "orderingKind":
			return " " + node.textContent;
		case "orderModifier":
			return Fleur.Serializer.XQX_renderChildren(node);
  /*
		case "orderBySpec":
    <xsl:apply-templates select="xqx:orderByExpr"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:apply-templates select="xqx:orderModifier"/>
  </xsl:template>
		case "orderByClause":
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
/*
			case "positionalVariableBinding":
    <xsl:text> at </xsl:text>
    <xsl:value-of select="$DOLLAR"/>
    <xsl:call-template name="renderEQName"/>
  </xsl:template>
		case "variableBinding":
    <xsl:value-of select="$DOLLAR"/>
    <xsl:call-template name="renderEQName"/>
    <xsl:if test="parent::xqx:typeswitchExprCaseClause">
      <xsl:text> as </xsl:text>
    </xsl:if>
  </xsl:template>
		case "typedVariableBinding" name="typedVariableBinding":
    <xsl:value-of select="$DOLLAR"/>
    <xsl:apply-templates select="xqx:varName"/>
    <xsl:apply-templates select="xqx:typeDeclaration"/>
  </xsl:template>
		case "quantifiedExprInClause":
    <xsl:apply-templates select="xqx:typedVariableBinding"/>
    <xsl:text> in </xsl:text>
    <xsl:apply-templates select="xqx:sourceExpr"/>
  </xsl:template>
		case "quantifiedExpr":
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
		case "instanceOfExpr":
    <xsl:value-of select="$LPAREN"/>
    <xsl:apply-templates select="xqx:argExpr"/>
    <xsl:text> instance of </xsl:text>
    <xsl:apply-templates select="xqx:sequenceType"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "castExpr":
    <xsl:value-of select="$LPAREN"/>
    <xsl:apply-templates select="xqx:argExpr"/>
    <xsl:text> cast as </xsl:text>
    <xsl:apply-templates select="xqx:singleType"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "castableExpr":
    <xsl:value-of select="$LPAREN"/>
    <xsl:apply-templates select="xqx:argExpr"/>
    <xsl:text> castable as </xsl:text>
    <xsl:apply-templates select="xqx:singleType"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "treatExpr":
    <xsl:value-of select="$LPAREN"/>
    <xsl:apply-templates select="xqx:argExpr"/>
    <xsl:text> treat as </xsl:text>
    <xsl:apply-templates select="xqx:sequenceType"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "switchExprCaseClause":
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
		case "switchExprDefaultClause":
    <xsl:value-of select="$NEWLINE"/>
    <xsl:text>   default return </xsl:text>
    <xsl:apply-templates select="xqx:resultExpr"/>
  </xsl:template>
		case "switchExpr":
    <xsl:value-of select="$LPAREN"/>
    <xsl:text>switch</xsl:text>
    <xsl:value-of select="$LPAREN"/>
    <xsl:apply-templates select="xqx:argExpr"/>
    <xsl:value-of select="$RPAREN"/>
    <xsl:apply-templates select="xqx:switchExprCaseClause"/>
    <xsl:apply-templates select="xqx:switchExprDefaultClause"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "typeswitchExprCaseClause":
    <xsl:text> case </xsl:text>
    <xsl:apply-templates select="xqx:variableBinding"/>
    <xsl:apply-templates select="xqx:sequenceType | xqx:sequenceTypeUnion"/>
    <xsl:text> return </xsl:text>
    <xsl:apply-templates select="xqx:resultExpr"/>
  </xsl:template>
		case "typeswitchExprDefaultClause":
    <xsl:text> default </xsl:text>
    <xsl:apply-templates select="xqx:variableBinding"/>
    <xsl:text> return </xsl:text>
    <xsl:apply-templates select="xqx:resultExpr"/>
  </xsl:template>
		case "typeswitchExpr":
    <xsl:value-of select="$LPAREN"/>
    <xsl:text>typeswitch</xsl:text>
    <xsl:value-of select="$LPAREN"/>
    <xsl:apply-templates select="xqx:argExpr"/>
    <xsl:value-of select="$RPAREN"/>
    <xsl:apply-templates select="xqx:typeswitchExprCaseClause"/>
    <xsl:apply-templates select="xqx:typeswitchExprDefaultClause"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "tryCatchExpr":
    <xsl:value-of select="$NEWLINE"/>
    <xsl:value-of select="$LPAREN"/>
    <xsl:text>try </xsl:text>
    <xsl:apply-templates select="xqx:tryClause"/>
    <xsl:apply-templates select="xqx:catchClause"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "tryClause":
    <xsl:value-of select="$LBRACE"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:apply-templates/>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "catchClause":
    <xsl:value-of select="$NEWLINE"/>
    <xsl:text>  catch </xsl:text>
    <xsl:apply-templates select="xqx:catchErrorList"/>
    <xsl:apply-templates select="xqx:catchExpr"/>
  </xsl:template>
		case "catchErrorList":
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
		case "catchExpr":
    <xsl:value-of select="$NEWLINE"/>
    <xsl:value-of select="$LBRACE"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:apply-templates/>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "validateExpr":
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
			/*
		case "dynamicFunctionInvocationExpr":
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
		case "functionItem":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "mapConstructor":
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
		case "mapConstructorEntry":
    <xsl:apply-templates select="*[1]"/>
    <xsl:text> : </xsl:text>
    <xsl:apply-templates select="*[2]"/>
  </xsl:template>
  */
		case "arrayConstructor":
			return Fleur.Serializer.XQX_renderChildren(node);
			/*
		case "squareArray":
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
		case "textTest":
    <xsl:text>text()</xsl:text>
  </xsl:template>
		case "commentTest":
    <xsl:text>comment()</xsl:text>
  </xsl:template>
		case "namespaceTest":
    <xsl:text>namespace-node()</xsl:text>
  </xsl:template>
		case "anyKindTest":
    <xsl:text>node()</xsl:text>
  </xsl:template>
		case "piTest":
    <xsl:text>processing-instruction</xsl:text>
    <xsl:value-of select="$LPAREN"/>
    <xsl:value-of select="*"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "documentTest":
    <xsl:text>document-node</xsl:text>
    <xsl:value-of select="$LPAREN"/>
    <xsl:apply-templates select="*"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
  */
		case "nameTest":
			return Fleur.Serializer.XQX_renderEQName(node);
  /*
		case "attributeTest":
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
		case "elementTest":
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
		case "schemaElementTest":
    <xsl:text>schema-element</xsl:text>
    <xsl:value-of select="$LPAREN"/>
    <xsl:call-template name="renderEQName"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "schemaAttributeTest":
    <xsl:text>schema-attribute</xsl:text>
    <xsl:value-of select="$LPAREN"/>
    <xsl:call-template name="renderEQName"/>
    <xsl:value-of select="$RPAREN"/>
  </xsl:template>
		case "anyFunctionTest":
    <xsl:apply-templates select="xqx:annotation"/>
    <xsl:text> function(*)</xsl:text>
  </xsl:template>
		case "typedFunctionTest":
    <xsl:apply-templates select="xqx:annotation"/>
    <xsl:text> function</xsl:text>
    <xsl:apply-templates select="xqx:paramTypeList"/>
    <xsl:text> as </xsl:text>
    <xsl:apply-templates select="xqx:sequenceType"/>
  </xsl:template>
		case "paramTypeList":
    <xsl:call-template name="parenthesizedList"/>
  </xsl:template>
		case "anyMapTest":
    <xsl:text> map(*)</xsl:text>
  </xsl:template>
		case "typedMapTest":
    <xsl:text> map(</xsl:text>
    <xsl:apply-templates select="xqx:atomicType"/>
    <xsl:text>, </xsl:text>
    <xsl:apply-templates select="xqx:sequenceType"/>
    <xsl:text>) </xsl:text>
  </xsl:template>
		case "lookup":
    <xsl:text> ?</xsl:text>
    <xsl:apply-templates/>
  </xsl:template>
		case "arrowPostfix":
    <xsl:text> => </xsl:text>
    <xsl:apply-templates select="*[not(self::xqx:arguments)]"/>
    <xsl:if test="xqx:arguments">
      <xsl:for-each select="xqx:arguments">
        <xsl:call-template name="parenthesizedList"/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>
		case "anyArrayTest":
    <xsl:text> array(*)</xsl:text>
  </xsl:template>
		case "typedArrayTest":
    <xsl:text> array(</xsl:text>
    <xsl:apply-templates select="xqx:sequenceType"/>
    <xsl:text>) </xsl:text>
  </xsl:template>
		case "parenthesizedItemType":
    <xsl:text> ( </xsl:text>
    <xsl:apply-templates/>
    <xsl:text> ) </xsl:text>
  </xsl:template>
  */
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
			/*
		case "filterExpr":
    <xsl:apply-templates/>
  </xsl:template>
		case "namedFunctionRef":
    <xsl:apply-templates select="xqx:functionName"/>
    <xsl:text>#</xsl:text>
    <xsl:apply-templates select="xqx:integerConstantExpr"/>
  </xsl:template>
		case "inlineFunctionExpr":
    <xsl:apply-templates select="xqx:annotation"/>
    <xsl:text> function </xsl:text>
    <xsl:apply-templates select="xqx:paramList"/>
    <xsl:apply-templates select="xqx:typeDeclaration"/>
    <xsl:apply-templates select="xqx:functionBody"/>
  </xsl:template>
  */
		case "pathExpr":
			return Fleur.Serializer.XQX_renderChildren(node, ["rootExpr", "stepExpr"]);
			/*
		case "attributeConstructor":
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
		case "namespaceDeclaration":
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
		case "attributeList":
    <xsl:apply-templates select="*"/>
  </xsl:template>
		case "elementContent":
    <xsl:for-each select="*">
      <xsl:if test="not(self::xqx:elementConstructor)">
        <xsl:value-of select="$SPACE"/>
        <xsl:value-of select="$LBRACE"/>
      </xsl:if>
      <xsl:apply-templates select="."/>
      <xsl:if test="not(self::xqx:elementConstructor)">
        <xsl:value-of select="$SPACE"/>
        <xsl:value-of select="$RBRACE"/>
      </xsl:if>
    </xsl:for-each>
  </xsl:template>
		case "elementConstructor":
    <xsl:value-of select="$LESSTHAN"/>
    <xsl:apply-templates select="xqx:tagName"/>
    <xsl:apply-templates select="xqx:attributeList"/>
    <xsl:value-of select="$GREATERTHAN"/>
    <xsl:apply-templates select="xqx:elementContent"/>
    <xsl:value-of select="$LESSTHAN"/>
    <xsl:value-of select="$SLASH"/>
    <xsl:apply-templates select="xqx:tagName"/>
    <xsl:value-of select="$GREATERTHAN"/>
  </xsl:template>
		case "tagNameExpr":
    <xsl:value-of select="$LBRACE"/>
    <xsl:apply-templates select="*"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "computedElementConstructor":
    <xsl:text> element </xsl:text>
    <xsl:apply-templates select="xqx:tagName"/>
    <xsl:apply-templates select="xqx:tagNameExpr"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$LBRACE"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:apply-templates select="xqx:contentExpr"/>     
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "contentExpr":
    <xsl:apply-templates/>
  </xsl:template>
		case "computedAttributeConstructor":
    <xsl:text> attribute </xsl:text>
    <xsl:apply-templates select="xqx:tagName"/>
    <xsl:apply-templates select="xqx:tagNameExpr"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$LBRACE"/>
    <xsl:apply-templates select="xqx:valueExpr"/>     
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "computedDocumentConstructor":
    <xsl:text> document {</xsl:text>
    <xsl:apply-templates select="*"/>
    <xsl:text> }</xsl:text>
  </xsl:template>
		case "computedTextConstructor":
    <xsl:text> text</xsl:text>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$LBRACE"/>
    <xsl:apply-templates select="*"/>
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "computedCommentConstructor":
    <xsl:text> comment</xsl:text>
    <xsl:value-of select="$LBRACE"/>
    <xsl:apply-templates select="*"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "computedNamespaceConstructor":
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
		case "piTargetExpr":
    <xsl:value-of select="$LBRACE"/>
    <xsl:apply-templates select="*"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "piValueExpr":
    <xsl:apply-templates select="*"/>
  </xsl:template>
		case "computedPIConstructor":
    <xsl:text> processing-instruction </xsl:text>
    <xsl:value-of select="xqx:piTarget"/>
    <xsl:apply-templates select="xqx:piTargetExpr"/>
    <xsl:value-of select="$LBRACE"/>
    <xsl:apply-templates select="xqx:piValueExpr"/>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "unorderedExpr":
    <xsl:text> unordered</xsl:text>
        <xsl:value-of select="$LBRACE"/>
    <xsl:text> </xsl:text>
    <xsl:apply-templates select="*"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "orderedExpr":
    <xsl:text> ordered</xsl:text>
        <xsl:value-of select="$LBRACE"/>
    <xsl:text> </xsl:text>
    <xsl:apply-templates select="*"/>
    <xsl:text> </xsl:text>
    <xsl:value-of select="$RBRACE"/>
  </xsl:template>
		case "versionDecl":
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
			/*
		case "copyNamespacesDecl":
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
			/*
		case "decimalFormatDecl":
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
			/*
		case "sequenceTypeUnion":
    <xsl:apply-templates select="xqx:sequenceType[1]"/>
    <xsl:if test="count(xqx:sequenceType) > 1">
      <xsl:for-each select="xqx:sequenceType[position() > 1]">
        <xsl:text> | </xsl:text>
        <xsl:apply-templates select="."/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>
		case "singleType":
    <xsl:apply-templates select="xqx:atomicType"/>
    <xsl:if test="xqx:optional">
      <xsl:text>?</xsl:text>
    </xsl:if>
  </xsl:template>
  */
		case "typeDeclaration":
		case "contextItemType":
			return " as " + Fleur.Serializer.XQX_renderChildren(node);
			/*
		case "contextItemDecl":
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
		case "annotation":
    <xsl:value-of select="$SPACE"/>
    <xsl:value-of select="$PERCENT"/>
    <xsl:apply-templates select="xqx:annotationName"/>
    <xsl:if test="xqx:arguments">
      <xsl:for-each select="xqx:arguments">
         <xsl:call-template name="parenthesizedList"/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>
		case "varDecl":
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
		case "targetLocation":
    <xsl:choose>
      <xsl:when test="position()=1"> at </xsl:when>
      <xsl:otherwise>,&#xD;  </xsl:otherwise>
    </xsl:choose>
    <xsl:call-template name="quote">
      <xsl:with-param name="item" select="."/>
    </xsl:call-template>
  </xsl:template>
		case "schemaImport":
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
		case "moduleImport":
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
Fleur.Serializer.prototype.serializeToString = function(node, mediatype, indent) {
	var media = mediatype.split(";"), config = {}, param, paramreg = /^\s*(\S*)\s*=\s*(\S*)\s*$/, i = 1, l = media.length, handler;
	while (i < l) {
		param = paramreg.exec(media[i]);
		config[param[1]] = param[2];
		i++;
	}
	handler = Fleur.Serializer.Handlers[media[0].replace(/^\s+|\s+$/gm,'')];
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
		return Fleur.Serializer._serializeXQXToString(node);
	},
	"text/csv": function(node, indent, config) {
		var ser = Fleur.Serializer._serializeCSVToString(node, config.header === "present", config.key ? parseInt(config.key, 10) : null, config.separator ? decodeURIComponent(config.separator) : ",", 0);
		return ser;
	},
	"application/json": function(node, indent) {
		var ser = Fleur.Serializer._serializeJSONToString(node, indent, "", false, "");
		if (indent && ser.charAt(ser.length - 1) === "\n") {
			ser = ser.substr(0, ser.length - 1);
		}
		return ser;
	},
};
Fleur.Serializer.Handlers["text/xml"] = Fleur.Serializer.Handlers["application/xml"];
Fleur.Serializer.Handlers["application/xquery+xml"] = Fleur.Serializer.Handlers["application/xml"];
Fleur.Serializer.Handlers["text/json"] = Fleur.Serializer.Handlers["application/json"];