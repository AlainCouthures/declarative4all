export class Context {
  item = null;
  path = null;
  initialpath = null;
  itemstack = [];
  pathstack = [];
  tuplestack = [];
  tuple = null;
  rs = {};
  nodedeps = [];
  nodedepset = new Set();
  xfdeps = [];
  xfdepset = new Set();
  position = null;
  engine = null;
  constructor(path, rs, nodedeps, xfdeps, position) {
    this.path = path;
    this.initialpath = path;
    this.rs = {
      now: rs?.now ?? dateToDateTime(),
      nsresolver: rs?.nsresolver ?? new XpathNsResolver(),
      varresolver: rs?.varresolver ?? new varMgr(),
      collection: rs?.collection ?? (path?.nodeType === DOCUMENT_NODE ? path : path?.ownerDocument ?? new Sequence()),
    };
    this.nodedeps = nodedeps ?? [];
    this.nodedeps.forEach(({ internal_id }) => this.nodedepset.add(internal_id));
    this.xfdeps = xfdeps ?? [];
    this.xfdeps.forEach(xfdep => this.xfdepset.add(xfdep));
    this.position = position;
    this.engine = Fleur;
  }
  clone(path) {
    return Object.assign(new Context(path), {
      rs: this.rs,
      nodedeps: this.nodedeps,
      nodedepset: this.nodedepset,
      xfdeps: this.xfdeps,
      xfdepset: this.xfdepset
    });
  }
  emptySequence() {
    this.itemstack.push(this.item);
    this.item = new Sequence();
    return this;
  }
  current() {
    this.itemstack.push(this.item);
    this.item = this.path;
    return this;
  }
  addnodedep(item) {
    if (!this.nodedepset.has(item.internal_id)) {
      this.nodedepset.add(item.internal_id);
      this.nodedeps.push(item);
    }
  }
  addxfdep(item) {
    if (!this.xfdepset.has(item)) {
      this.xfdepset.add(item);
      this.xfdeps.push(item);
    }
  }
  restoreContext() {
    this.path = this.pathstack.pop();
    const items = this.item.isSingle() ? [this.item] : this.item.childNodes;
    items.forEach(item => this.addnodedep(item));
    return this;
  }
  dropTrue() {
    return this.item?.textContent === "true" && (this.item = this.itemstack.pop(), true);
  }
  dropFalse() {
    return this.item?.textContent === "false" && (this.item = this.itemstack.pop(), true);
  }
  isTrue() {
    const result = this.item?.textContent === "true";
    this.item = this.itemstack.pop();
    return result;
    }
  isFalse() {
    const result = this.item?.textContent === "false";
    this.item = this.itemstack.pop();
    return result;
    }
  atomize(expectedSequenceType) {
    this.item = atomize(this.item);
    if (expectedSequenceType && !this.item.schemaTypeInfo.as(expectedSequenceType.schemaTypeInfo)) {
      xqueryError("XPST0017", null, "Invalid type");
    }
    return this;
  }
  typeConstructor(schemaType) {
    if (this.item.isEmpty()) {
      return this;
    }
    const res = new Declarative4All.Text();
    if (schemaType === Declarative4All.Type_numeric) {
      try {
        res.textContent = Declarative4All.Type_integer.canonicalize(this.item.textContent);
        res.schemaTypeInfo = Declarative4All.Type_integer;
        this.item = res;
        return this;
      } catch (e) {}
      try {
        res.textContent = Declarative4All.Type_decimal.canonicalize(this.item.textContent);
        res.schemaTypeInfo = Declarative4All.Type_decimal;
        this.item = res;
        return this;
      } catch (e) {}
      try {
        res.textContent = Declarative4All.Type_float.canonicalize(this.item.textContent);
        res.schemaTypeInfo = Declarative4All.Type_float;
        this.item = res;
        return this;
      } catch (e) {}
      try {
        res.textContent = Declarative4All.Type_double.canonicalize(this.item.textContent);
        res.schemaTypeInfo = Declarative4All.Type_double;
        this.item = res;
        return this;
      } catch (e) {
        xqueryError(e.code === VALIDATION_ERR ? "FORG0001" : "FODT0001", null, "Wrong argument for xs:" + schemaType.typeName + "#1", "", this.item);
      }
    }
    if (this.item.schemaTypeInfo === Declarative4All.Type_string || this.item.schemaTypeInfo === Declarative4All.Type_untypedAtomic) {
      if (!this.item.hasOwnProperty("data")) {
        xqueryError("FORG00001", null, "Wrong argument for xs:" + schemaType.typeName + "#1", "", this.item);
      }
    }
    try {
      res.textContent = schemaType.canonicalize(this.item.textContent);
      res.schemaTypeInfo = schemaType;
      this.item = res;
      return this;
    } catch (e) {
      xqueryError(e.code === VALIDATION_ERR ? "FORG0001" : "FODT0001", null, "Wrong argument for xs:" + schemaType.typeName + "#1", "", this.item);
    }
  }
  notyet() {
    xqueryError("XPST0001", null, "Not yet implemented");
  }
  staticinst(transp) {
    if (this.item.isEmpty()) {
      return {
        inst: transp.inst("xqx_sequenceExpr(0)", false).inst,
        sequenceType: Declarative4All.SequenceType_empty_sequence,
        value: this.item
      };
    }
    return {
      inst: transp.inst("xqx_constantExpr(Declarative4All.Type_" + this.item.schemaTypeInfo.typeName + ", '" + this.item.textContent.replace(/\\/g, "\\\\").replace(/\'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") + "')", false).inst,
      sequenceType: new Declarative4All.SequenceType(TEXT_NODE, this.item.schemaTypeInfo, "1"),
      value: this.item
    };
  }
  log() {
    const ser = this.fn_serialize_1().item.textContent;
    if (ser.length !== 0) {
      console.log(ser);
    }
  }
}

Declarative4All.Context = Context;