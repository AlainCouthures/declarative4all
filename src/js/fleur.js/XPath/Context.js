/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */

Fleur.Context = function(path, rs) {
  this.item = null;
  this.path = path;
  this.rs = rs;
  this.itemstack = [];
  this.pathstack = [];
};

Fleur.Context.prototype.emptySequence = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Sequence();
  this.item = item;
  return this;
};

Fleur.Context.XPATHAXIS_ANCESTOR = 0;
Fleur.Context.XPATHAXIS_ANCESTOR_OR_SELF = 1;
Fleur.Context.XPATHAXIS_ATTRIBUTE = 2;
Fleur.Context.XPATHAXIS_CHILD = 3;
Fleur.Context.XPATHAXIS_DESCENDANT = 4;
Fleur.Context.XPATHAXIS_DESCENDANT_OR_SELF = 5;
Fleur.Context.XPATHAXIS_FOLLOWING = 6;
Fleur.Context.XPATHAXIS_FOLLOWING_SIBLING = 7;
Fleur.Context.XPATHAXIS_NAMESPACE = 8;
Fleur.Context.XPATHAXIS_PARENT = 9;
Fleur.Context.XPATHAXIS_PRECEDING = 10;
Fleur.Context.XPATHAXIS_PRECEDING_SIBLING = 11;
Fleur.Context.XPATHAXIS_SELF = 12;

Fleur.Context.prototype.restoreContext = function() {
  this.path = this.pathstack.pop();
  return this;
};

Fleur.Context.prototype.dropTrue = function() {
  const val = this.item.data === "true";
  if (val) {
    this.item = this.itemstack.pop();
  }
  return val;
};
Fleur.Context.prototype.dropFalse = function() {
  const val = this.item.data === "false";
  if (val) {
    this.item = this.itemstack.pop();
  }
  return val;
};

Fleur.Context.prototype.isTrue = function() {
  const val = this.item.data === "true";
  this.item = this.itemstack.pop();
  return val;
};
Fleur.Context.prototype.isFalse = function() {
  const val = this.item.data === "false";
  this.item = this.itemstack.pop();
  return val;
};

Fleur.Context.prototype.atomize = function() {
  this.item = Fleur.Atomize(this.item);
  return this;
}