/*eslint-env browser*/
/*globals XsltForms_type */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module ListType
 * @description  === "XsltForms_listType" class ===
 * ListType Class
 * * constructor function : white space management as "collapse"
 */
		
function XsltForms_listType() {
	this.whiteSpace = "collapse";
}

XsltForms_listType.prototype = new XsltForms_type();


		
/**
 * * '''setItemType''' method : associates a Type object for each item in this ListType object
 */

XsltForms_listType.prototype.setItemType = function(itemType) {
	this.itemType = typeof itemType === "string"? this.schema.getType(itemType) : itemType;
	return this;
};


		
/**
 * * '''validate''' method : validates a value against this ListType object
 */

XsltForms_listType.prototype.validate = function(value) {
	var l = 0, items = this.itemType.canonicalValue.call(this, value).split(" ");
	for (var i = 0, len = items.length; i < len; i++) {
		if (items[i] !== "") {
			l++;
			var item = this.itemType.validate(items[i]);
			if (!item) {
				return false;
			}
		}
	}
	if ( (this.minLength && l < this.minLength) ||
		(this.maxLength && l > this.maxLength)) {
		return false;
	}
	return true;
};


		
/**
 * * '''canonicalValue''' method : computes the canonical value of a list value
 */

XsltForms_listType.prototype.canonicalValue = function(value) {
	var items = this.itemType.canonicalValue(value).split(" ");
	var cvalue = "";
	for (var i = 0, len = items.length; i < len; i++) {
		var item = this.itemType.canonicalValue(items[i]);
		cvalue += (cvalue.length === 0 ? "" : " ") + item;
	}
	return cvalue;
};