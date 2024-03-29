/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */

Fleur.signatures = {};

Fleur.XPathFunctions = {};
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/array"] = {};
Fleur.XPathFunctions_array = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/array"];
Fleur.XPathFunctions["http://xqib.org"] = {};
Fleur.XPathFunctions_b = Fleur.XPathFunctions["http://xqib.org"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions"] = {};
Fleur.XPathFunctions_fn = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/map"] = {};
Fleur.XPathFunctions_map = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/map"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/math"] = {};
Fleur.XPathFunctions_math = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/math"];
Fleur.XPathFunctions["http://www.w3.org/2001/XMLSchema"] = {};
Fleur.XPathFunctions_xs = Fleur.XPathFunctions["http://www.w3.org/2001/XMLSchema"];
Fleur.XPathFunctions["http://www.w3.org/2005/xquery-local-functions"] = {};
Fleur.XPathFunctions_local = Fleur.XPathFunctions["http://www.w3.org/2005/xquery-local-functions"];
Fleur.XPathFunctions["http://expath.org/ns/binary"] = {};
Fleur.XPathFunctions_bin = Fleur.XPathFunctions["http://expath.org/ns/binary"];
Fleur.XPathFunctions["http://expath.org/ns/file"] = {};
Fleur.XPathFunctions_file = Fleur.XPathFunctions["http://expath.org/ns/file"];
Fleur.XPathFunctions["http://expath.org/ns/http-client"] = {};
Fleur.XPathFunctions_http = Fleur.XPathFunctions["http://expath.org/ns/http-client"];
Fleur.XPathFunctions["http://exquery.org/ns/request"] = {};
Fleur.XPathFunctions_request = Fleur.XPathFunctions["http://exquery.org/ns/request"];
Fleur.XPathFunctions["http://basex.org/modules/prof"] = {};
Fleur.XPathFunctions_prof = Fleur.XPathFunctions["http://basex.org/modules/prof"];
Fleur.XPathFunctions["http://basex.org/modules/proc"] = {};
Fleur.XPathFunctions_proc = Fleur.XPathFunctions["http://basex.org/modules/proc"];
Fleur.XPathFunctions["http://www.agencexml.com/fleur/dgram"] = {};
Fleur.XPathFunctions_dgram = Fleur.XPathFunctions["http://www.agencexml.com/fleur/dgram"];
Fleur.XPathFunctions["https://tools.ietf.org/rfc/index"] = {};
Fleur.XPathFunctions_ietf = Fleur.XPathFunctions["https://tools.ietf.org/rfc/index"];
Fleur.XPathFunctions["http://www.agencexml.com/fleur/base64"] = {};
Fleur.XPathFunctions_base64 = Fleur.XPathFunctions["http://www.agencexml.com/fleur/base64"];
Fleur.XPathFunctions["http://www.agencexml.com/fleur/internal"] = {};
Fleur.XPathFunctions_internal = Fleur.XPathFunctions["http://www.agencexml.com/fleur/internal"];
Fleur.XPathFunctions["http://schemas.openxmlformats.org/spreadsheetml/2006/main"] = {};
Fleur.XPathFunctions_excel = Fleur.XPathFunctions["http://schemas.openxmlformats.org/spreadsheetml/2006/main"];
Fleur.XPathFunctions["http://expath.org/ns/zip"] = {};
Fleur.XPathFunctions_zip = Fleur.XPathFunctions["http://expath.org/ns/zip"];
Fleur.XPathFunctions["http://www.mathunion.org/matrix"] = {};
Fleur.XPathFunctions_matrix = Fleur.XPathFunctions["http://www.mathunion.org/matrix"];
Fleur.XPathFunctions["http://www.agencexml.com/fleur/unit"] = {};
Fleur.XPathFunctions_unit = Fleur.XPathFunctions["http://www.agencexml.com/fleur/unit"];
Fleur.XPathFunctions["http://www.w3.org/2005/xquery"] = {};
Fleur.XPathFunctions_xquery = Fleur.XPathFunctions["http://www.w3.org/2005/xquery"];
Fleur.XPathFunctions["http://www.w3.org/2002/xforms"] = {};
Fleur.XPathFunctions_xf = Fleur.XPathFunctions["http://www.w3.org/2002/xforms"];
Fleur.canonize = {};