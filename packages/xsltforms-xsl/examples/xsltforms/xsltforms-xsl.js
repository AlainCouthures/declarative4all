document.documentElement.style.visibility = "hidden";
(async () => {
  try {
    const xsltforms_xsl = await import("./xsltforms-xsl.mjs");
    const text = await fetch(location.href, { cache: "no-cache" }).then(r => r.text());
    const match = text.match(/src="([^"]*?)xsltforms-xsl\.js/);
    if (!match) {
      throw new Error("Could not find xsltforms-xsl.js script tag.");
    }
    const path = match[1];
    const close = text.indexOf("</script>", match.index);
    if (close === -1) {
      throw new Error("Missing </script> tag.");
    }
    let xml = text.slice(close + 9).replace(/^\s+/, "");
    if (xml.startsWith('<plaintext>')) {
      xml = xml.substring(11);
    }
    const html = xsltforms_xsl.fromXhtmlToHtml(xml, path);
    document.open();
    document.write(html);
    document.close();
  } catch (e) {
    console.error("XSLTForms bootstrap failed:", e);
    document.documentElement.style.visibility = "visible";
  }
})();
