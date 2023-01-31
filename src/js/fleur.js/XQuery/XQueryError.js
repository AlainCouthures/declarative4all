"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryError = function(namespaceURI, localName, prefix, position, description, module, value, additional) {
  throw {
    name: "XQueryError",
    message: "fn:error(xs:QName('" + namespaceURI + "', '" + (prefix ? prefix + ":" : "") + localName + "')" + (!Fleur.TestSuite ? ", '" + description + "'" + (value ? ", " + Fleur.Serializer._serializeNodeToXQuery(value, false, "") : "") : "") + ")",
    namespaceURI: namespaceURI,
    localName: localName,
    prefix: prefix,
    position: position,
    description: description,
    module: module,
    value: value,
    additional: additional
  };
};

Fleur.XQueryError_xqt = function(localName, position, description, module, value, additional) {
  Fleur.XQueryError("http://www.w3.org/2005/xqt-errors", localName, "err", position, description, module, value, additional);
};