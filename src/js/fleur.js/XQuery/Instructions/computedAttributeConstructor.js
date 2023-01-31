"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_computedAttributeConstructor = function(children) {
  let r = "";
  const prefix = children[0][1].length === 2 && children[0][1][1][0] === Fleur.XQueryX.prefix ? children[0][1][1][1][0] : "";
  const URI = children[0][1].length === 2 && children[0][1][1][0] === Fleur.XQueryX.URI ? children[0][1][1][1][0] : null;
  let tagName;
  if (children[0][0] === Fleur.XQueryX.tagName) {
    tagName = children[0][1][0];
  } else {
    r = this.gen(children[0][1][0], Fleur.SequenceType_anyAtomicType_1).inst;
  }
  r += this.gen(children[1][1][0], Fleur.SequenceType_anyAtomicType_1).inst;
  r += this.inst("xqx_computedAttributeConstructor" + (tagName ? (URI ? "_URI" : "") + "('" + (URI ? URI : prefix) + "', '" + tagName + "')" : "_expr()")).inst;
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_attribute_1
  };
};

Fleur.Context.prototype.xqx_computedAttributeConstructor = function(prefix, localName) {
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

Fleur.Context.prototype.xqx_computedAttributeConstructor_expr = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  const attr = new Fleur.Attr();
  const prefix = arg1.data.includes(":") ? arg1.data.split(":")[0] : "";
  attr.nodeName = arg1.data;
  attr.localName = prefix === "" ? arg1.data : arg1.data.split(":")[1];
  attr.prefix = prefix === "" ? null : prefix;
  attr.namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  arg2.schemaTypeInfo = Fleur.Type_untypedAtomic;
  attr.appendChild(arg2);
  this.item = attr;
  return this;
};

Fleur.Context.prototype.xqx_computedAttributeConstructor_URI = function(URI, localName) {
  const attr = new Fleur.Attr();
  attr.nodeName = localName;
  attr.localName = localName;
  attr.prefix = null;
  attr.namespaceURI = URI;
  this.item.schemaTypeInfo = Fleur.Type_untypedAtomic;
  attr.appendChild(this.item);
  this.item = attr;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.computedAttributeConstructor] = function(ctx, children, callback) {
  var attr = new Fleur.Attr();
  if (children[0][0] === Fleur.XQueryX.tagName) {
    attr.name = children[0][1][0];
    attr.namespaceURI = null;
    attr.nodeName = children[0][1][0];
    attr.localName = children[0][1][0];
    if (children[1][1].length === 0) {
      Fleur.callback(function() {callback(attr);});
      return;
    }
    Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
      attr.appendChild(n);
      Fleur.callback(function() {callback(attr);});
    });
  } else {
    Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
      var a = Fleur.Atomize(n);
      if (a.nodeType !== Fleur.Node.TEXT_NODE) {
        Fleur.callback(function() {callback(a);});
      } else {
        attr.name = a.data;
        attr.nodeName = a.data;
        attr.namespaceURI = null;
        attr.localName = a.data;
        if (children[1][1].length === 0) {
          Fleur.callback(function() {callback(attr);});
          return;
        }
        Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
          attr.appendChild(n);
          Fleur.callback(function() {callback(attr);});
        });
      }
    });
  }
};
*/