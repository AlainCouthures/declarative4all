"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module UnionType
 * @description  === "XsltForms_unionType" class ===
 * UnionType Class
 * * constructor function : initializes base types property
 */
    
function XsltForms_unionType(memberTypes) {
  this.baseTypes = [];
  this.memberTypes = memberTypes ? memberTypes.split(" ") : [];
}

XsltForms_unionType.prototype = new XsltForms_type();


    
/**
 * * '''addType''' method : adds a Type object to this UnionType object
 */

XsltForms_unionType.prototype.addType = function(type) {
  this.baseTypes.push(typeof type === "string"? this.schema.getType(type) : type);
  return this;
};


    
/**
 * * '''addTypes''' method : specifies the elementary types of this UnionType object
 */

XsltForms_unionType.prototype.addTypes = function() {
  for (var i = 0, len = this.memberTypes.length; i < len; i++ ) {
    this.baseTypes.push(this.schema.getType(this.memberTypes[i]));
  }
  return this;
};


    
/**
 * * '''validate''' method : validates a value against at least one base type of this UnionType object
 */

XsltForms_unionType.prototype.validate = function (value) {
  for (var i = 0, len = this.baseTypes.length; i < len; ++i) {
    if (this.baseTypes[i].validate(value)) {
      return true;
    }
  }
  return false;
};