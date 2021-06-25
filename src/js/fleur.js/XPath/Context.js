/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */

Fleur.Context = function(path, rs, nodedeps, xfdeps, position) {
  this.item = null;
  this.path = path;
  this.initialpath = path;
  this.itemstack = [];
  this.pathstack = [];
  if (rs) {
    this.rs = rs;
  }
  if (nodedeps) {
    this.nodedeps = nodedeps;
    this.nodedepset = new Set();
    const nodedepset = this.nodedepset;
    this.nodedeps.forEach(nodedep => nodedepset.add(nodedep.internal_id));
  }
  if (xfdeps) {
    this.xfdeps = xfdeps;
    this.xfdepset = new Set();
    const xfdepset = this.xfdepset;
    this.xfdeps.forEach(xfdep => xfdepset.add(xfdep));
  }
  this.position = position;
};

Fleur.Context.prototype.clone = function(path) {
  const newcontext = new Fleur.Context(path);
  newcontext.rs = this.rs;
  newcontext.nodedeps = this.nodedeps;
  newcontext.nodedepset = this.nodedepset;
  newcontext.xfdeps = this.xfdeps;
  newcontext.xfdepset = this.xfdepset;
  return newcontext;
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

Fleur.Context.prototype.addnodedep = function(item) {
  if (!this.nodedepset.has(item.internal_id)) {
    this.nodedepset.add(item.internal_id);
    this.nodedeps.push(item);
  }
};

Fleur.Context.prototype.addxfdep = function(item) {
  if (!this.xfdepset.has(item)) {
    this.xfdepset.add(item);
    this.xfdeps.push(item);
  }
};

Fleur.Context.prototype.restoreContext = function() {
  this.path = this.pathstack.pop();
  if (this.item.isSingle()) {
    this.addnodedep(this.item);
  } else {
    const ctx = this;
    this.item.childNodes.forEach(item => ctx.addnodedep(item));
  }
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
};

Fleur.Context.prototype.typeConstructor = function(schemaType) {
  if (this.item.isEmpty()) {
    return this;
  }
  this.item = Fleur.Atomize(this.item);
  if (this.item.schemaTypeInfo === Fleur.Type_string || this.item.schemaTypeInfo === Fleur.Type_untypedAtomic) {
    if (!this.item.hasOwnProperty("data")) {
      Fleur.XQueryError_xqt("FORG00001", null, "Wrong argument type for xs:" + schemaType.atomizerName.substr(3, schemaType.atomizerName - 5) + "#1", "", this.item);
    }
  }
  try {
    this.item.data = schemaType.canonicalize(this.item.textContent);
    this.item.schemaTypeInfo = schemaType;
    return this;
  } catch (e) {
    Fleur.XQueryError_xqt(e.code === Fleur.DOMException.VALIDATION_ERR ? "FORG0001" : "FODT0001", null, "Wrong argument type for xs:" + schemaType.atomizerName.substr(3, schemaType.atomizerName - 5) + "#1", "", this.item);
  }
};