"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Collations = {};

Fleur.getCollation = function(collation) {
  var c = Fleur.Collations[collation];
  if (!c && !collation.startsWith("http://")) {
    c = Fleur.Collations["http://www.w3.org/2005/xpath-functions/collation/" + collation];
  }
  return c;
};

Fleur.Collations["http://www.w3.org/2005/xpath-functions/collation/codepoint"] = {
  equals: function(a, b) {
    return a === b;
  },
  lessThan: function(a, b) {
    return a < b;
  },
  greaterThan: function(a, b) {
    return a > b;
  },
  startsWith: function(a, b) {
    return a.startsWith(b);
  },
  endsWith: function(a, b) {
    return a.endsWith(b);
  },
  contains: function(a, b) {
    return a.indexOf(b) !== -1;
  },
  substringBefore: function(a, b) {
    var i = a.indexOf(b);
    return i === -1 ? "" : a.substr(0, i);
  },
  substringAfter: function(a, b) {
    var i = a.indexOf(b);
    return i === -1 ? "" : a.substr(i + b.length);
  }
};

Fleur.Collations["http://www.w3.org/2005/xpath-functions/collation/html-ascii-case-insensitive"] = {
  equals: function(a, b) {
    return a.toLowerCase() === b.toLowerCase();
  },
  lessThan: function(a, b) {
    return a.toLowerCase() < b.toLowerCase();
  },
  greaterThan: function(a, b) {
    return a.toLowerCase() > b.toLowerCase();
  },
  startsWith: function(a, b) {
    return a.toLowerCase().startsWith(b.toLowerCase());
  },
  endsWith: function(a, b) {
    return a.toLowerCase().endsWith(b.toLowerCase());
  },
  contains: function(a, b) {
    return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
  },
  substringBefore: function(a, b) {
    var i = a.toLowerCase().indexOf(b.toLowerCase());
    return i === -1 ? "" : a.substr(0, i);
  },
  substringAfter: function(a, b) {
    var i = a.toLowerCase().indexOf(b.toLowerCase());
    return i === -1 ? "" : a.substr(i + b.length);
  }
};

Fleur.Collations["http://www.w3.org/2010/09/qt-fots-catalog/collation/caseblind"] = Fleur.Collations["http://www.w3.org/2005/xpath-functions/collation/html-ascii-case-insensitive"];