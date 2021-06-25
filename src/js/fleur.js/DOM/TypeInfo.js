"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.TypeInfo = function(typeNamespace, typeName, derivations) {
  this.typeNamespace = typeNamespace;
  this.typeName = typeName;
  Fleur.Types[typeNamespace][typeName] = this;
  this.derivations = derivations;
};

Fleur.TypeInfo_XMLSchema = function(typeName, derivations) {
  Fleur.TypeInfo.call(this, "http://www.w3.org/2001/XMLSchema", typeName, derivations);  
};

Fleur.TypeInfo_XMLSchema.prototype = Object.create(Fleur.TypeInfo.prototype);

Fleur.TypeInfo.DERIVATION_RESTRICTION = 1;
Fleur.TypeInfo.DERIVATION_EXTENSION = 2;
Fleur.TypeInfo.DERIVATION_UNION = 4;
Fleur.TypeInfo.DERIVATION_LIST = 8;
Fleur.TypeInfo.prototype.canonicalize = function(s) {return s;};

Fleur.TypeInfo.prototype.isDerivedFrom_ = function(typeArg, derivationMethod) {
  if (this === typeArg) {
    return true;
  }
  if (this.derivations) {
    for (let i = 0, l = this.derivations.length; i < l; i++) {
      if (typeArg === this.derivations[i][1] && (derivationMethod === 0 || (derivationMethod & this.derivations[i][0]) !== 0)) {
        return true;
      }
      if (this.derivations[i][1].isDerivedFrom_(typeArg, derivationMethod)) {
        return true;
      }
    }
  }
  return false;
};
Fleur.TypeInfo.prototype.isDerivedFrom = function(typeNamespaceArg, typeNameArg, derivationMethod) {
  return this.isDerivedFrom_(Fleur.Types[typeNamespaceArg][typeNameArg], derivationMethod);
};

Fleur.TypeInfo.prototype.as = function(targetedType) {
  if (this.isDerivedFrom_(targetedType, Fleur.DERIVATION_RESTRICTION)) {
    return true;
  }
  if (targetedType.derivations) {
    for (let i= 0, l = targetedType.derivations.length; i < l; i++) {
      if (targetedType.derivations[i][0] === Fleur.TypeInfo.DERIVATION_UNION) {
        if (this.as(targetedType.derivations[i][1])) {
          return true;
        }
      }
    }
  }
  return false;
};

Fleur.TypeInfo.prototype.getPrimitiveType = function(types, derivationMethod) {
  var propname, t, prim;
  switch (derivationMethod) {
    case Fleur.TypeInfo.DERIVATION_RESTRICTION:
      propname = "restriction";
      break;
    case Fleur.TypeInfo.DERIVATION_EXTENSION:
      propname = "extension";
      break;
    case Fleur.TypeInfo.DERIVATION_UNION:
      propname = "union";
      break;
    case Fleur.TypeInfo.DERIVATION_LIST:
      propname = "list";
      break;
  }
  if (types.indexOf(this) !== -1) {
    return this;
  }
  prim = this;
  t = this[propname];
  while (t) {
    if (types.indexOf(t) !== -1) {
      return t;
    }
    prim = t;
    t = t[propname];
  }
  return prim;
};
Fleur.TypeInfo.prototype.compareType = function(typeArg, derivationMethod) {
  var propname, t;
  switch (derivationMethod) {
    case Fleur.TypeInfo.DERIVATION_RESTRICTION:
      propname = "restriction";
      break;
    case Fleur.TypeInfo.DERIVATION_EXTENSION:
      propname = "extension";
      break;
    case Fleur.TypeInfo.DERIVATION_UNION:
      propname = "union";
      break;
    case Fleur.TypeInfo.DERIVATION_LIST:
      propname = "list";
      break;
  }
  var arr = [this];
  t = this[propname];
  while (t) {
    if (t === typeArg) {
      return typeArg;
    }
    arr.push(t);
    t = t[propname];
  }
  t = typeArg;
  while (t) {
    if (arr.indexOf(t) !== -1) {
      return t;
    }
    t = t[propname];
  }
  return null;
};