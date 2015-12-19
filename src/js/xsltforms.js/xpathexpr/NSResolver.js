/*eslint-env browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module NSResolver
 * @description  === XsltForms_nSResolver Class ===
 * XPath Expression Class for namespace resolving
 * * constructor function : initializes map property as an empty associative array
 */
		
function XsltForms_nsResolver() {
	this.map = {};
	this.notfound = false;
}


		
/**
 * * '''registerAll''' method : registers all the namespaces from a given resolver in this Namespace Resolver object
 */

XsltForms_nsResolver.prototype.registerAll = function(resolver) {
	for (var prefix in resolver.map) {
		if (resolver.map.hasOwnProperty(prefix)) {
			this.map[prefix] = resolver.map[prefix];
		}
	}
};


		
/**
 * * '''register''' method : registers a prefix and an uri in this Namespace Resolver object
 */

XsltForms_nsResolver.prototype.register = function(prefix, uri) {
	this.map[prefix] = uri;
	if( uri === "notfound" ) {
		this.notfound = true;
	}
};


		
/**
 * * '''registerNotFound''' method : registers a prefix for a not found uri in this Namespace Resolver object
 */

XsltForms_nsResolver.prototype.registerNotFound = function(prefix, uri) {
	if( this.map[prefix] === "notfound" ) {
		this.map[prefix] = uri;
		for (var p in this.map) {
			if (this.map.hasOwnProperty(p)) {
				if (this.map[p] === "notfound") {
					this.notfound = true;
				}
			}
		}
	}
};


		
/**
 * * '''lookupNamespaceURI''' method : looks up for the corresponding uri for a given prefix in this Namespace Resolver object
 */

XsltForms_nsResolver.prototype.lookupNamespaceURI = function(prefix) {
	return this.map[prefix];
};