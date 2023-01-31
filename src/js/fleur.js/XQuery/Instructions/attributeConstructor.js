"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_attributeConstructor = function(children) {
  let r = "";
  const prefix = children[0][1].length === 2 ? children[0][1][1][1][0] : "";
  let value;
  if (children[1][0] === Fleur.XQueryX.attributeValue) {
    value = children[1][1][0];
  } else {
    r = this.gen(children[1][1][0], Fleur.atomicTypes).inst;
  }
  r += this.inst("xqx_attributeConstructor" + (value ? "_value" : "") + "('" +  prefix + "', '" + children[0][1][0] + "'" + (value ? ", '" + value + "'" : "") + ")").inst;
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_attribute_1
  };
};

Fleur.Context.prototype.xqx_attributeConstructor = function(prefix, localName) {
  const attr = new Fleur.Attr();
  attr.nodeName = prefix === "" ? localName : prefix + ":" + localName;
  attr.localName = localName;
  attr.prefix = prefix === "" ? null : prefix;
  attr.namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  this.item.schemaTypeInfo = Fleur.Type_untypedAtomic;
  attr.appendChild(this.item);
  this.item = attr;
  return this;
};

Fleur.Context.prototype.xqx_attributeConstructor_value = function(prefix, localName, value) {
  const attr = new Fleur.Attr();
  attr.nodeName = prefix === "" ? localName : prefix + ":" + localName;
  attr.localName = localName;
  attr.prefix = prefix === "" ? null : prefix;
  attr.namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  const attrvalue = new Fleur.Text(value);
  attrvalue.schemaTypeInfo = Fleur.Type_untypedAtomic;
  attr.appendChild(attrvalue);
  this.itemstack.push(this.item);
  this.item = attr;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.attributeConstructor] = function(ctx, children, callback, elt) {
  var attr = new Fleur.Attr();
  var t;
  attr.nodeName = children[0][1][0];
  attr.localName = children[0][1][0];
  if (children[0][1].length === 2) {
    attr.prefix = children[0][1][1][1][0];
  } else {
    attr.prefix = null;
  }
  attr.namespaceURI = elt.lookupNamespaceURI(attr.prefix) || ctx.env.nsresolver.lookupNamespaceURI(attr.prefix);
  if (children[1][0] === Fleur.XQueryX.attributeValue) {
    if (children[1][1].length !== 0) {
      t = new Fleur.Text();
      t.data = children[1][1][0];
      attr.appendChild(t);
    }
    Fleur.callback(function() {callback(attr);});
  } else {
    t = new Fleur.Text();
    t.data = "";
    attr.appendChild(t);
    Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
      Fleur.callback(function() {callback(n);});
    }, attr);
  }
};
*/