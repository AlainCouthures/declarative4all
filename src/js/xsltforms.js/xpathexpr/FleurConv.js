/*eslint-env browser*/
/*globals XsltForms_globals Fleur*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module FleurConv
 * @description  === XsltForms_FleurConv ===
 * Converter from Fleur XQuery parser result to XPath engine
 */
		
var XsltForms_FleurConv = [];
var XsltForms_FleurConv_unsupported = function() {
	return "~~~~Unsupported syntax~#~#";
};
for (var XsltForms_i = 0; XsltForms_i < Fleur.Xlength; XsltForms_i++) {
	XsltForms_FleurConv[XsltForms_i] = XsltForms_FleurConv_unsupported;
}
XsltForms_FleurConv[Fleur.XQueryX.anyKindTest] = function() {
	return "new XsltForms_nodeTestAny()";
};
XsltForms_FleurConv[Fleur.XQueryX.arrayTest] = function() {
	return "new XsltForms_nodeTestType(131)";
};
XsltForms_FleurConv[Fleur.XQueryX.commentTest] = function() {
	return "new XsltForms_nodeTestType(8)";
};
XsltForms_FleurConv[Fleur.XQueryX.contextItemExpr] = function() {
	return "new XsltForms_locationExpr(false,new XsltForms_stepExpr('self',new XsltForms_nodeTestAny()))";
};
XsltForms_FleurConv[Fleur.XQueryX.decimalConstantExpr] = function(children) {
	return "new XsltForms_cteExpr(" + children[0][1][0] + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.doubleConstantExpr] = function(children) {
	return "new XsltForms_cteExpr(" + children[0][1][0] + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.entryTest] = function() {
	return "new XsltForms_nodeTestType(133)";
};
XsltForms_FleurConv[Fleur.XQueryX.filterExpr] = function() {
	return "new XsltForms_stepExpr('self',new XsltForms_nodeTestAny())";
};
XsltForms_FleurConv[Fleur.XQueryX.functionCallExpr] = function(children) {
	var fname = children[0][1][0];
	var uri = "http://www.w3.org/2005/xpath-functions";
	var args = children[1][1];
	if (children[0][1][1] && children[0][1][1][0] === Fleur.XQueryX.prefix) {
		var pf = children[0][1][1][1][0];
		if (pf === "xf" || pf === "xform" || pf === "xforms") {
			uri = "http://www.w3.org/2002/xforms";
		} else if (pf === "math") {
			uri = "http://exslt.org/math";
		} else {
			uri = Fleur.XPathNSResolver_default.uri[Fleur.XPathNSResolver_default.pf.indexOf(pf)];
		}
	} else if (" boolean-from-string is-card-number count-non-empty index power random if choose property digest hmac local-date local-dateTime now days-from-date days-to-date seconds-from-dateTime seconds-to-dateTime adjust-dateTime-to-timezone seconds months instance current context event nodeindex is-valid serialize transform ".indexOf(" " + fname + " ") !== -1) {
		uri = "http://www.w3.org/2002/xforms";
	}
	var ret = "new XsltForms_functionCallExpr('" + uri + " " + fname + "'";
	for (var i = 0, l = args.length; i < l; i++) {
		ret += "," + XsltForms_FleurConv[args[i][0]](args[i][1]);
	}
	ret += ")";
	return ret;
};
XsltForms_FleurConv[Fleur.XQueryX.integerConstantExpr] = function(children) {
	return "new XsltForms_cteExpr(" + children[0][1][0] + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.mapTest] = function() {
	return "new XsltForms_nodeTestType(132)";
};
XsltForms_FleurConv[Fleur.XQueryX.nameTest] = function(children, axis) {
	var ret = "new XsltForms_nodeTestName(";
	if (children.length !== 1 && children[1][0] === Fleur.XQueryX.prefix) {
		ret += "'" + children[1][1][0] + "'";
	} else if (axis === "attribute") {
		ret += "null";
	} else {
		ret += "''";
	}
	ret += ",'";
	ret += children[0];
	ret += "')";
	return ret;
};
XsltForms_FleurConv[Fleur.XQueryX.pathExpr] = function(children) {
	var ret = "";
	var i = 0;
	var pathexpr = false;
	if (children[0][0] === Fleur.XQueryX.stepExpr && children[0][1][0][0] === Fleur.XQueryX.filterExpr && children[0][1][0][1][0][0] !== Fleur.XQueryX.contextItemExpr) {
		pathexpr = true;
		ret = "new XsltForms_pathExpr(";
		ret += XsltForms_FleurConv[children[0][1][0][1][0][0]](children[0][1][0][1][0][1]);
		ret += ",";
		i++;
	}
	ret += "new XsltForms_locationExpr(";
	if (children[0][0] !== Fleur.XQueryX.rootExpr) {
		ret += "false";
		if (!pathexpr) {
			ret += ",";
		}
	}
	for (var l = children.length; i < l; i++) {
		ret += (i !== 0 ? "," : "") + XsltForms_FleurConv[children[i][0]](children[i][1]);
	}
	ret += ")";
	if (pathexpr) {
		ret += ")";
	}
	return ret;
};
XsltForms_FleurConv[Fleur.XQueryX.piTest] = function(children) {
	return "new XsltForms_nodeTestPi(" + (children.length !== 0 ? "'" + children[0][1][0] + "'" : "") + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.predicates] = function(children) {
	var ret = "";
	for (var i = 0, l = children.length; i < l; i++) {
		ret += ",new XsltForms_predicateExpr(" + XsltForms_FleurConv[children[i][0]](children[i][1]) + ")";
	}
	return ret;
};
XsltForms_FleurConv[Fleur.XQueryX.rootExpr] = function() {
	return "true";
};
XsltForms_FleurConv[Fleur.XQueryX.stepExpr] = function(children) {
	if (children.length === 1) {
		return XsltForms_FleurConv[children[0][0]](children[0][1]);
	}
	var lpred;
	var ret = "new XsltForms_stepExpr('";
	if (children[0][0] === Fleur.XQueryX.xpathAxis) {
		ret += children[0][1][0];
		ret += "',";
		ret += XsltForms_FleurConv[children[1][0]](children[1][1], children[0][1][0]);
		lpred = 3;
	} else {
		ret += "self',new XsltForms_nodeTestAny()";
		lpred = 2;
	}
	if (children.length === lpred) {
		ret += XsltForms_FleurConv[children[lpred - 1][0]](children[lpred - 1][1]);
	}
	ret += ")";
	return ret;
};
XsltForms_FleurConv[Fleur.XQueryX.stringConstantExpr] = function(children) {
	return "new XsltForms_cteExpr('" + (children[0][1][0] || "").replace(/\'/g, "\\'") + "')";
};
XsltForms_FleurConv[Fleur.XQueryX.textTest] = function() {
	return "new XsltForms_nodeTestType(3)";
};
XsltForms_FleurConv[Fleur.XQueryX.varRef] = function(children) {
	var nsURI;
	if (children[0][1].length === 1) {
		nsURI = "";
	} else {
		nsURI = children[0][1][1][1][0] + ":";
	}
	return "new XsltForms_varRef(\"" + nsURI + children[0][1][0] + "\")";
};
XsltForms_FleurConv[Fleur.XQueryX.Wildcard] = function(children, axis) {
	if (axis !== 'attribute') {
		if (children.length === 0) {
			return "new XsltForms_nodeTestType(1)";
		}
		if (children[0][0] === Fleur.XQueryX.NCName) {
			return "new XsltForms_nodeTestName('" + children[0][1][0] + "','')),new XsltForms_stepExpr('" + axis + "',new XsltForms_nodeTestType(1)";
		}
		return "new XsltForms_nodeTestName('*','" + children[1][1][0] + "')";
	}
	if (children.length === 0) {
		return "new XsltForms_nodeTestAny()";
	}
	if (children[0][0] === Fleur.XQueryX.NCName) {
		return "new XsltForms_nodeTestName('" + children[0][1][0] + "','*')";
	}
	return "new XsltForms_nodeTestName('*','" + children[1][1][0] + "')";
};
XsltForms_FleurConv[Fleur.XQueryX.addOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'+'," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.andOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'and'," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.divOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'div'," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.equalOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'='," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.greaterThanOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'>'," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.greaterThanOrEqualOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'>='," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.lessThanOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'<'," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.lessThanOrEqualOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'<='," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.modOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'mod'," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.multiplyOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'*'," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.notEqualOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'!='," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.orOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'or'," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.subtractOp] = function(children) {
	return "new XsltForms_binaryExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + ",'-'," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};
XsltForms_FleurConv[Fleur.XQueryX.unaryMinusOp] = function(children) {
	var operand = children[0][1][0][0];
	if (operand === Fleur.XQueryX.integerConstantExpr || operand === Fleur.XQueryX.decimalConstantExpr || operand === Fleur.XQueryX.doubleConstantExpr) {
		return "new XsltForms_cteExpr(-" + children[0][1][0][1][0][1] + ")";
	}
};
XsltForms_FleurConv[Fleur.XQueryX.unionOp] = function(children) {
	return "new XsltForms_unionExpr(" + XsltForms_FleurConv[children[0][1][0][0]](children[0][1][0][1]) + "," + XsltForms_FleurConv[children[1][1][0][0]](children[1][1][0][1]) + ")";
};