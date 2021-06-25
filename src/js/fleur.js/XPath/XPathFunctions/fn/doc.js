/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.extension2contentType = {
  ".css":   "text/css",
  ".csv":   "text/csv",
  ".docx":  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".gif":   "image/gif",
  ".htm":   "text/html",
  ".html":  "text/html",
  ".ico":   "image/x-icon",
  ".jpeg":  "image/jpeg",
  ".jpg":   "image/jpeg",
  ".js":    "application/javascript",
  ".json":  "application/json",
  ".ofx":   "application/x-ofx",
  ".png":   "image/png",
  ".svg":   "image/svg+xml",
  ".txt":   "text/plain",
  ".xhtml": "application/xhtml+xml",
  ".xlsx":  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xml":   "application/xml;charset=utf-8",
  ".xsl":   "text/xsl",
  ".zip":   "application/zip"
};

Fleur.extension2encoding = {
  ".css":   "utf8",
  ".csv":   "utf8",
  ".docx":  "binary",
  ".gif":   "binary",
  ".htm":   "utf8",
  ".html":  "utf8",
  ".ico":   "binary",
  ".jpeg":  "binary",
  ".jpg":   "binary",
  ".js":    "utf8",
  ".json":  "utf8",
  ".ofx":   "utf8",
  ".png":   "binary",
  ".svg":   "utf8",
  ".txt":   "utf8",
  ".xhtml": "utf8",
  ".xlsx":  "binary",
  ".xml":   "utf8",
  ".xsl":   "utf8",
  ".zip":   "binary"
};

Fleur.encoding2encoding = {
  "us-ascii":   "latin1",
  "iso-8859-1": "latin1",
  "utf-8":      "utf8",
  "utf-16":     "utf16le"   
};

Fleur.signatures.fn_doc_1 = {
  need_ctx: false,
  is_async: true,
  return_type: null,
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "1"
    }
  ]
};
Fleur.signatures.fn_doc_2 = {
  need_ctx: false,
  is_async: true,
  return_type: null,
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "1"
    },
    null
  ]
};
Fleur.signatures.fn_doc_3 = {
  need_ctx: false,
  is_async: true,
  return_type: null,
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_string,
      occurrence: "1"
    },
    null,
    null
  ]
};
Fleur.Context.prototype.fn_doc_1_async = async function() {
  await this.emptySequence().emptySequence().fn_doc_3_async();
  return this;
};
Fleur.Context.prototype.fn_doc_2_async = async function() {
  await this.emptySequence().fn_doc_3_async();
  return this;
};
Fleur.Context.prototype.fn_doc_3_async = async function() {
  let contentType = null;
  let encoding = null;
  let jsserial = {};
  let data = this.item;
  let serialization = this.itemstack.pop();
  let docname = this.itemstack.pop().data;
  if (serialization.isNotEmpty()) {
    const a2 = Fleur.Atomize(serialization);
    const  op2 = Fleur.toJSObject(a2);
    if (op2[0] < 0) {
      return a2;
    }
    jsserial = op2[1];
    contentType = Fleur.toContentType(serialization);
    if (jsserial.encoding) {
      encoding = Fleur.encoding2encoding[jsserial.encoding.toLowerCase()];
    }
  }
  const httpget = docname.startsWith("http://") || Fleur.inBrowser;
  const cmdexec = docname.startsWith("cmd://");
  const ps1exec = docname.startsWith("ps1://");
  const fileread = (docname.startsWith("file://") || !httpget) && !cmdexec && !ps1exec;
  const parser = new Fleur.DOMParser();
  if (httpget) {
    if (!Fleur.inBrowser) {
      //console.log(docname);
      const options = global.url.parse(docname);
      options.method = (jsserial["http-verb"] || "GET").toUpperCase();
      options.headers = jsserial["http-headers"] || {};
      if (jsserial["http-cookie"]) {
        options.headers.Cookie = jsserial["http-cookie"];
      }
      let postdata = null;
      if (data.isNotEmpty()) {
        const ser = new Fleur.Serializer();
        postdata = ser.serializeToString(data, contentType);
        options.headers["Content-Type"] = contentType;
        options.headers["Content-Length"] = postdata.length;
        //console.log(postdata);
      }
      var resdata = "";
    } else {
      const response = await fetch(docname);
      this.item = parser.parseFromString(await response.text(), contentType || response.headers.get("Content-Type"));
      this.position = 1;
      this.last = 1;
      return this;
    }
  } else if (fileread) {
    if (docname.startsWith("file://")) {
      docname = docname.substr(7);
    }
    let extension = global.path.extname(docname).toLowerCase();
    if (!contentType) {
      contentType = Fleur.extension2contentType[extension] || "application/xml";
    }
    if (!encoding) {
      encoding = "utf8";
    }
    //console.log(docname);console.log(process.cwd());
    const thisisit = this;
    global.fs.readFile(docname, encoding, function(err, file) {
      if (err) {
        //console.log(err);
        thisisit.item = Fleur.error(thisisit.ctx, "FODC0002");
      } else {
        //console.log(file.charCodeAt(1));
        thisisit.item = parser.parseFromString(file.startsWith('\uFEFF') ? file.substr(1) : file, contentType);
      }
    });
  } else if (cmdexec || ps1exec) {
    docname = decodeURIComponent(docname.substr(6));
    if (!contentType) {
      contentType = "application/xml";
    }
    var dropone = false;
    if (global.os.platform() === "win32") {
      if (cmdexec) {
        docname = "@chcp 65001 | " + docname;
      } else {
        docname = "%SystemRoot%\\system32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -NoLogo -NonInteractive -ExecutionPolicy Bypass \"& {chcp 65001 ; $ProgressPreference='SilentlyContinue' ; " + docname + "}\"";
        dropone = true;
        //console.log(docname);
      }
    }
    const thisisit = this;
    global.child_process.exec(docname, {windowsHide: true, maxBuffer: 1024*1024*1024}, function(err, stdout, stderr) {
      if (err) {
        thisisit.item = Fleur.error(thisisit.ctx, "FOPR0001");
      } else if (stderr) {
        thisisit.item = Fleur.error(thisisit.ctx, "FOPR0001");
      } else {
        //console.log(stdout.replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
        if (dropone) {
          stdout = stdout.substr(stdout.indexOf("\r\n") + 2);
        }
        //console.log(stdout.replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
        thisisit.item = parser.parseFromString(stdout, contentType);
      }
    });
  }
};

Fleur.XPathFunctions_fn["doc#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
  function(docname, ctx, callback) {
    return Fleur.XPathFunctions_fn["doc#3"].jsfunc(docname, null, null, ctx, callback);
  },
  null, [{type: Fleur.Type_string}], true, true, {type: Fleur.Node});

Fleur.XPathFunctions_fn["doc#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
  function(docname, serialization, ctx, callback) {
    return Fleur.XPathFunctions_fn["doc#3"].jsfunc(docname, serialization, null, ctx, callback);
  },
  null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.Node});

Fleur.XPathFunctions_fn["doc#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
  function(docname, serialization, data, ctx, callback) {
    var contentType;
    var encoding;
    if (serialization) {
      var a2 = Fleur.Atomize(serialization);
      var  op2 = Fleur.toJSObject(a2);
      if (op2[0] < 0) {
        callback(a2);
        return;
      }
      serialization = op2[1];
      contentType = Fleur.toContentType(serialization);
      if (serialization["encoding"]) {
        encoding = Fleur.encoding2encoding[serialization["encoding"].toLowerCase()];
      }
    }
    var httpget = docname.startsWith("http://") || Fleur.inBrowser;
    var cmdexec = docname.startsWith("cmd://");
    var ps1exec = docname.startsWith("ps1://");
    var fileread = (docname.startsWith("file://") || !httpget) && !cmdexec && !ps1exec;
    var parser = new Fleur.DOMParser();
    if (httpget) {
      if (!Fleur.inBrowser) {
        //console.log(docname);
        var options = global.url.parse(docname);
        options.method = (serialization["http-verb"] || "GET").toUpperCase();
        options.headers = serialization["http-headers"] || {};
        if (serialization["http-cookie"]) {
          options.headers.Cookie = serialization["http-cookie"];
        }
        var postdata = null;
        if (data) {
          var ser = new Fleur.Serializer();
          postdata = ser.serializeToString(data, contentType);
          options.headers["Content-Type"] = contentType;
          options.headers["Content-Length"] = postdata.length;
          //console.log(postdata);
        }
        var resdata = "";
        var hreq = global.http.request(options, function(res) {
          res.setEncoding("utf8");
          res.on("data", function(chunk) {
            resdata += chunk;
            //console.log("chunk length: " + chunk.length);
          });
          res.on("end", function() {
            //console.log(resdata);
            callback(parser.parseFromString(resdata, res.headers["Content-Type"] || contentType));
          });
        });
        if (serialization["timeout"]) {
          hreq.setTimeout(parseInt(serialization["timeout"], 10), function() {
            callback(null);
          });
        }
        hreq.on("error", function(e) {
          callback(e);
        });
        if (postdata) {
          hreq.write(postdata);
        }
        hreq.end();
      } else {
        var getp = new Promise(function(resolve, reject) {
          var req = new XMLHttpRequest();
          req.open(serialization && serialization["http-verb"] ? serialization["http-verb"].toUpperCase() : "GET", docname, true);
          //req.setRequestHeader("Cache-Control", "no-cache");
          req.onload = function() {
            if (req.status === 200) {
              resolve({text: req.responseText, contenttype: serialization ? contentType : req.getResponseHeader("Content-Type")});
            } else {
              reject(Fleur.error(ctx, "FODC0002"));
                }
          };
          req.send(null);
        });
        getp.then(
          function(o) {
            callback(parser.parseFromString(o.text, o.contenttype));
          },
          function(a) {
            callback(a);
          }
        );
      }
    } else if (fileread) {
      if (docname.startsWith("file://")) {
        docname = docname.substr(7);
      }
      var extension = global.path.extname(docname).toLowerCase();
      if (!contentType) {
        contentType = Fleur.extension2contentType[extension] || "application/xml";
      }
      if (!encoding) {
        encoding = "utf8";
      }
      //console.log(docname);console.log(process.cwd());
      global.fs.readFile(docname, encoding, function(err, file) {
        if (err) {
          //console.log(err);
          callback(Fleur.error(ctx, "FODC0002"));
        } else {
          //console.log(file.charCodeAt(1));
          callback(parser.parseFromString(file.startsWith('\uFEFF') ? file.substr(1) : file, contentType));
        }
      });
    } else if (cmdexec || ps1exec) {
      docname = decodeURIComponent(docname.substr(6));
      if (!contentType) {
        contentType = "application/xml";
      }
      var dropone = false;
      if (global.os.platform() === "win32") {
        if (cmdexec) {
          docname = "@chcp 65001 | " + docname;
        } else {
          docname = "%SystemRoot%\\system32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -NoLogo -NonInteractive -ExecutionPolicy Bypass \"& {chcp 65001 ; $ProgressPreference='SilentlyContinue' ; " + docname + "}\"";
          dropone = true;
          //console.log(docname);
        }
      }
      global.child_process.exec(docname, {windowsHide: true, maxBuffer: 1024*1024*1024}, function(err, stdout, stderr) {
        if (err) {
          err.name = "FOPR0001";
          callback(err);
        } else if (stderr) {
          var e = new Error(stderr);
          e.name = "FOPR0001";
          callback(e);
        } else {
          //console.log(stdout.replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
          if (dropone) {
            stdout = stdout.substr(stdout.indexOf("\r\n") + 2);
          }
          //console.log(stdout.replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
          callback(parser.parseFromString(stdout, contentType));
        }
      });
    }
  },
  null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.Node});