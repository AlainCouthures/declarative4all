"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_computedEntryConstructor = function(children) {
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
  r += this.inst("xqx_computedEntryConstructor" + (tagName ? (URI ? "_URI" : "") + "('" + (URI ? URI : prefix) + "', '" + tagName + "')" : "_expr()")).inst;
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_entry_1
  };
};

Fleur.Context.prototype.xqx_computedEntryConstructor = function(prefix, localName) {
  const entry = new Fleur.Entry();
  entry.nodeName = prefix === "" ? localName : prefix + ":" + localName;
  entry.localName = localName;
  entry.prefix = prefix === "" ? null : prefix;
  entry.namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  this.item.schemaTypeInfo = Fleur.Type_untypedAtomic;
  entry.appendChild(this.item);
  this.item = entry;
  return this;
};

Fleur.Context.prototype.xqx_computedEntryConstructor_expr = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  const entry = new Fleur.Entry();
  const prefix = arg1.data.includes(":") ? arg1.data.split(":")[0] : "";
  entry.nodeName = arg1.data;
  entry.localName = prefix === "" ? arg1.data : arg1.data.split(":")[1];
  entry.prefix = prefix === "" ? null : prefix;
  entry.namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  arg2.schemaTypeInfo = Fleur.Type_untypedAtomic;
  entry.appendChild(arg2);
  this.item = entry;
  return this;
};

Fleur.Context.prototype.xqx_computedEntryConstructor_URI = function(URI, localName) {
  const entry = new Fleur.Entry();
  entry.nodeName = localName;
  entry.localName = localName;
  entry.prefix = null;
  entry.namespaceURI = URI;
  this.item.schemaTypeInfo = Fleur.Type_untypedAtomic;
  entry.appendChild(this.item);
  this.item = entry;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.computedEntryConstructor] = function(ctx, children, callback) {
  var entry = new Fleur.Entry();
  if (children[0][0] === Fleur.XQueryX.tagName) {
    entry.name = children[0][1][0];
    entry.namespaceURI = null;
    entry.nodeName = children[0][1][0];
    Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
      entry.appendChild(n);
      Fleur.callback(function() {callback(entry);});
    });
  } else {
    Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
      var a = Fleur.Atomize(n);
      if (a.nodeType !== Fleur.Node.TEXT_NODE) {
        Fleur.callback(function() {callback(a);});
      } else {
        entry.nodeName = a.data;
        entry.namespaceURI = null;
        entry.localName = a.data;
        Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
          entry.appendChild(n.copyNode());
          Fleur.callback(function() {callback(entry);});
        });
      }
    });
  }
};
*/