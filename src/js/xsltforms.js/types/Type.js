"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module Type
 * @description  === "XsltForms_type" class ===
 * Type Abstract Class
 * * constructor function : empty
 */
    
function XsltForms_type() {
}


    
/**
 * * '''setSchema''' method : associates a schema to this Type object
 */

XsltForms_type.prototype.setSchema = function(schema) {
  this.schema = schema;
  return this;
};


    
/**
 * * '''setName''' method : associates a name to this Type object and updates the schema accordingly
 */

XsltForms_type.prototype.setName = function(tname) {
  this.name = tname;
  this.nsuri = this.schema.ns;
  this.schema.types[tname] = this;
  return this;
};


    
/**
 * * '''canonicalValue''' method : computes the canonical value according to white space management (replace, collapse)
 */

XsltForms_type.prototype.canonicalValue = function(value) {
  value = value.toString();
  switch (this.whiteSpace) {
    case "replace":
      value = value.replace(/[\t\r\n]/g, " ");
      break;
    case "collapse":
      value = value.replace(/[\t\r\n ]+/g, " ").replace(/^\s+|\s+$/g, "");
      break;
  }

  return value;
};


    
/**
 * * '''getMaxLength''' method : get the max length for this Type object or null
 */

XsltForms_type.prototype.getMaxLength = function() {
  return this.maxLength ? this.maxLength : (this.length ? this.length : (this.totalDigits ? this.totalDigits + 1 : null));
};


    
/**
 * * '''getDisplayLength''' method : get the display length for this Type object
 */

XsltForms_type.prototype.getDisplayLength = function() {
  return this.displayLength;
};