/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.bin2utf8 = function(s) {
  var r = "";
  for (var i = 0, l = s.length; i < l;) {
    var c = s.charCodeAt(i);
    if (c < 128) {
      r += String.fromCharCode(c);
      i++;
    } else {
      if ((c > 191) && (c < 224)) {
        r += String.fromCharCode(((c & 31) << 6) | (s.charCodeAt(i + 1) & 63));
        i += 2;
      } else if ((c > 223) && (c < 240)) {
        r += String.fromCharCode(((c & 15) << 12) | ((s.charCodeAt(i + 1) & 63) << 6) | (s.charCodeAt(i + 2) & 63));
        i += 3;
      } else {
        r += String.fromCodePoint(((c & 7) << 18) | ((s.charCodeAt(i + 1) & 63) << 12) | ((s.charCodeAt(i + 2) & 63) << 6) | (s.charCodeAt(i + 3) & 63));
        i += 4;
      }
    }
  }
  return r;
};