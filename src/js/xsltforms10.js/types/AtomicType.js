/*eslint-env browser*/
/*globals XsltForms_type XsltForms_browser XsltForms_schema*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module AtomicType
 * @description  === "XsltForms_atomicType" class ===
 * AtomicType Class
 * * constructor function : initializes of patterns property
 */
		
function XsltForms_atomicType() {
	this.patterns = [];
}

XsltForms_atomicType.prototype = new XsltForms_type();


		
/**
 * * '''setBase''' method : copies the base patterns to this AtomicType object
 */

XsltForms_atomicType.prototype.setBase = function(base) {
	var baseType = typeof base === "string"? this.schema.getType(base) : base;
	for (var id in baseType)  {
		if (baseType.hasOwnProperty(id)) {
			var value = baseType[id];
			if (id === "patterns") {
				XsltForms_browser.copyArray(value, this.patterns);
			} else if (id !== "name" && id !== "nsuri" && id !== "base") {
				this[id] = value;
			}
		}
	}
	this.basensuri = baseType.nsuri;
	this.basename = baseType.name;
	return this;
};


		
/**
 * * '''hasBase''' method : checks base hierarchy for this AtomicType object
 */

XsltForms_atomicType.prototype.hasBase = function(base) {
	var baseType = XsltForms_schema.getType(base);
	var curType = this;
	while( curType !== baseType ){
		if (!curType.basename) {
			return false;
		}
		curType = XsltForms_schema.getTypeNS(curType.basensuri, curType.basename);
		if (!curType) {
			return false;
		}
	}
	return true;
};


		
/**
 * * '''put''' method : sets the base, copies patterns or just add a property
 */

XsltForms_atomicType.prototype.put = function(tname, value) {
	if (tname === "base") {
		this.setBase(value);
	} else if (tname === "pattern") {
		XsltForms_browser.copyArray([value], this.patterns);
	} else if (tname === "enumeration") {
		if (!this.enumeration) {
			this.enumeration = [];
		}
		this.enumeration.push(value);
	} else {
		if (tname === "length" || tname === "minLength" || tname === "maxLength" || tname === "fractionDigits" || tname === "totalDigits") {
			value = parseInt(value, 10);
		} else if (tname === "minInclusive" || tname === "maxInclusive") {
			value = parseFloat(value);
		}
		this[tname] = value;
	}
	
	return this;
};


		
/**
 * * '''validate''' method : validates a value against this AtomicType object
 */

/** If valid return canonicalValue else null*/
XsltForms_atomicType.prototype.validate = function (value) {
	value = this.canonicalValue(value);
	for (var i = 0, len = this.patterns.length; i < len; i++) {
		if (!value.match(this.patterns[i])) {
			return false;
		}
	}
	if (this.enumeration) {
		var matched = false;
		for (var j = 0, len1 = this.enumeration.length; j < len1; j++) {
			if (value === this.canonicalValue(this.enumeration[j])) {
				matched = true;
				break;
			}
		}
		if (!matched) {
			return false;
		}
	}
	var l = value.length;
	var value_i = parseInt(value, 10);
	if ( (typeof this.length === "number" && this.length !== l) ||
		(typeof this.minLength === "number" && l < this.minLength) ||
		(typeof this.maxLength === "number" && l > this.maxLength) ||
		(typeof this.maxInclusive === "number" && value_i > this.maxInclusive) ||
		(typeof this.maxExclusive === "number" && value_i >= this.maxExclusive) ||
		(typeof this.minInclusive === "number" && value_i < this.minInclusive) ||
		(typeof this.minExclusive === "number" && value_i <= this.minExclusive) ) {
		return false;
	}
	if (typeof this.totalDigits === "number" || typeof this.fractionDigits === "number") {
		var index = value.indexOf(".");
		var integer = "" + Math.abs(parseInt(index !== -1? value.substring(0, index) : value, 10));
		var decimal = index !== -1? value.substring(index + 1) : "";
		if (index !== -1) {
			if (this.fractionDigits === 0) {
				return false;
			}
			var dl = decimal.length - 1;
			while (dl >= 0 && decimal.charAt(dl) === 0) {
				dl--;
			}
			decimal = decimal.substring(0, dl + 1);
		}
		if ( (typeof this.totalDigits === "number" && integer.length + decimal.length > this.totalDigits) ||
			(typeof this.fractionDigits === "number" && decimal.length > this.fractionDigits)) {
			return false;
		}
	}
	return true;
};


		
/**
 * * '''normalize''' method : normalizes a value for fraction digits according to this AtomicType object
 */

XsltForms_atomicType.prototype.normalize = function (value) {
	if (typeof this.fractionDigits === "number") {
		var number = parseFloat(value);
		var num;
		if (isNaN(number)) {
			return "NaN";
		}
		if (number === 0) {
			num = XsltForms_browser.zeros(0, this.fractionDigits + 1, true);
		} else {
			var mult = XsltForms_browser.zeros(1, this.fractionDigits + 1, true);
			num = "" + Math.round(number * mult);
		}
		if (this.fractionDigits !== 0) {
			var index = num.length - this.fractionDigits;
			return (index === 0 ? "0" : num.substring(0, index)) + "." + num.substring(index);
		}
		return num;
	}
	return value;
};