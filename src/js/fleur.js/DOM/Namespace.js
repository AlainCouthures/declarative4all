"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Namespace = function() {
  Fleur.Node.apply(this);
  this.nodeType = Fleur.Node.NAMESPACE_NODE;
};
Fleur.Namespace.prototype = new Fleur.Node();
Object.defineProperties(Fleur.Namespace.prototype, {
  nodeValue: {
    set: function(value) {
      if (value) {
        if (!this.firstChild) {
          this.appendChild(this.ownerDocument.createTextNode(value));
          return;
        }
        this.firstChild.nodeValue = value;
        return;
      }
      if (this.firstChild) {
        this.removeChild(this.firstChild);
      }
    },
    get: function() {
      var s = "", i = 0, l = this.childNodes ? this.childNodes.length : 0;
      while (i < l) {
        s += this.childNodes[i].nodeValue;
        i++;
      }
      return s;
    }
  },
  specified: {
    get: function() {
      return !!this.firstChild;
    }
  },
  value: {
    set: function(value) {
      if (value) {
        if (!this.firstChild) {
          this.appendChild(this.ownerDocument.createTextNode(value));
          return;
        }
        this.firstChild.nodeValue = value;
        return;
      }
      if (this.firstChild) {
        this.removeChild(this.firstChild);
      }
    },
    get: function() {
      var s = "", i = 0, l = this.childNodes ? this.childNodes.length : 0;
      while (i < l) {
        s += this.childNodes[i].nodeValue;
        i++;
      }
      return s;
    }
  }
});