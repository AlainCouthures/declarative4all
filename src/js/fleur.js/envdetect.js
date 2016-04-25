/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.inBrowser = (new Function("try {return this === window;}catch(e){ return false;}"))();
Fleur.inNode = (new Function("try {return this === global;}catch(e){return false;}"))();