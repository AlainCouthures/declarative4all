<!--
XSLTForms 1.5.5 (661)
XForms 1.1+ Engine

Copyright (C) 2021 agenceXML - Alain Couthures
Contact at : xsltforms@agencexml.com

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
-->

<xsl:stylesheet xmlns:xhtml='http://www.w3.org/1999/xhtml' xmlns:ajx='http://www.ajaxforms.net/2006/ajx' xmlns:xforms='http://www.w3.org/2002/xforms' xmlns:ev='http://www.w3.org/2001/xml-events' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:msxsl='urn:schemas-microsoft-com:xslt' xmlns:exslt='http://exslt.org/common' xmlns:txs='http://www.agencexml.com/txs' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:dcterms='http://purl.org/dc/terms/' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0' exclude-result-prefixes='xhtml xforms ev exslt msxsl'><rdf:RDF>
<rdf:Description rdf:about='http://www.agencexml.com/xsltforms/xsltforms.xsl'>
<dcterms:title>XSLT 1.0 Stylesheet for XSLTForms</dcterms:title>
<dcterms:hasVersion>1.5.5 (661)</dcterms:hasVersion>
<dcterms:creator>Alain Couthures - agenceXML</dcterms:creator>
<dcterms:conformsTo>XForms 1.1</dcterms:conformsTo>
<dcterms:created>2021-05-23</dcterms:created>
<dcterms:description>XForms 1.1+ Engine</dcterms:description>
<dcterms:format>text/xsl</dcterms:format>
</rdf:Description>
</rdf:RDF><xsl:output method='html' encoding='utf-8' omit-xml-declaration='yes' indent='no' doctype-system='about:legacy-compat'/>
<xsl:param xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="baseuri"/>
<xsl:param xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="pwd"/>
<xsl:param xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="xsltforms_home"/>
<xsl:param xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="xsltforms_caller"/>
<xsl:param xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="xsltforms_chain"/>
<xsl:param xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="xsltforms_debug"/>
<xsl:param xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="xsltforms_replacement_for"/>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="xsltformspivalue" select="translate(normalize-space(/processing-instruction('xsltforms-options')[1]), ' ', '')"/>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="custom_elements">
	<xsl:choose>
		<xsl:when test="system-property('xsl:vendor') = 'Transformiix'">true</xsl:when>
		<xsl:otherwise>true</xsl:otherwise>
	</xsl:choose>
</xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="piform" select="processing-instruction('xml-form')"/>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="piforminstanceid">
	<xsl:if test="contains($piform, ' instance=&quot;')">
		<xsl:value-of select="substring-before(substring-after($piform, ' instance=&quot;'), '&quot;')"/>
	</xsl:if>
</xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="piforminstance" select="/"/>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="piformhref"><xsl:if test="contains($piform, ' href=&quot;')"><xsl:value-of select="substring-before(substring-after($piform, ' href=&quot;'), '&quot;')"/></xsl:if></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="piformdoc" select="document(concat($pwd, $piformhref))"/>
<xsl:variable name="jsrevision"/>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="required-position">
			<xsl:variable name="requiredquote" select="substring(substring-after($xsltformspivalue, 'required-position='), 1, 1)"/>
			<xsl:value-of select="substring-before(substring-after($xsltformspivalue, concat('required-position=', $requiredquote)), $requiredquote)"/>
</xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="main" select="/"/>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="amp"><xsl:text>&amp;</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="apos"><xsl:text>'</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="lt"><xsl:text>&lt;</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="gt"><xsl:text>&gt;</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="quot"><xsl:text>"</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="backslash"><xsl:text>\</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="lineseparator"><xsl:text>&#8232;</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="newline"><xsl:text>&#10;</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="carriagereturn"><xsl:text>&#13;</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="tab"><xsl:text>&#9;</xsl:text></xsl:variable>
<xsl:variable xmlns:xsl="http://www.w3.org/1999/XSL/Transform" name="nbsp"><xsl:text>&#160;</xsl:text></xsl:variable>
<xsl:template match="/" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xforms="http://www.w3.org/2002/xforms" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:exslt="http://exslt.org/common" xmlns:xalan="http://xml.apache.org/xalan">
	<xsl:if test="system-property('xsl:vendor') = 'libxslt'">
		<xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
	</xsl:if>
	<xsl:choose>
		<xsl:when test="$piform != ''">
			<xsl:apply-templates select="$piformdoc/*"/>
		</xsl:when>
		<xsl:otherwise>
			<xsl:apply-templates/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>
<xsl:template match="xhtml:html | html" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xforms="http://www.w3.org/2002/xforms" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:exslt="http://exslt.org/common" xmlns:xalan="http://xml.apache.org/xalan">
	<xsl:variable name="pivalue" select="translate(normalize-space(/processing-instruction('xml-stylesheet')[1]), ' ', '')"/>
	<xsl:variable name="hrefquote" select="substring(substring-after($pivalue, 'href='), 1, 1)"/>
	<xsl:variable name="href" select="substring-before(substring-after($pivalue, concat('href=', $hrefquote)), $hrefquote)"/>
	<xsl:variable name="resourcesdir">
		<xsl:choose>
			<xsl:when test="$baseuri != ''">
				<xsl:value-of select="$baseuri"/>
			</xsl:when>
			<xsl:when test="$xsltforms_home != ''">
				<xsl:value-of select="$xsltforms_home"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="substring-before($href, 'xsltforms.xsl')"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="resourcesdircss">
		<xsl:choose>
			<xsl:when test="$resourcesdir = 'xsl/'">css/</xsl:when>
			<xsl:when test="substring($resourcesdir, string-length($resourcesdir) - 4) = '/xsl/'">
				<xsl:value-of select="concat(substring($resourcesdir, 1, string-length($resourcesdir) - 4), 'css/')"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$resourcesdir"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="resourcesdirjs">
		<xsl:choose>
			<xsl:when test="$resourcesdir = 'xsl/'">js/</xsl:when>
			<xsl:when test="substring($resourcesdir, string-length($resourcesdir) - 4) = '/xsl/'">
				<xsl:value-of select="concat(substring($resourcesdir, 1, string-length($resourcesdir) - 4), 'js/')"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$resourcesdir"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<html>
		<xsl:copy-of select="@*"/>
		<xsl:if test="namespace::*">
			<xsl:for-each select="self::*/namespace::*[not(contains('..xml.', concat('.', name(), '.')))]">
				<xsl:attribute name="{name()}:xmlns" namespace="{.}"></xsl:attribute>
			</xsl:for-each>
		</xsl:if>
		<xsl:comment>HTML elements generated by XSLTForms 1.5.5 (661) - Copyright (C) 2021 &lt;agenceXML&gt; - Alain Couthures - http://www.agencexml.com</xsl:comment>
		<xsl:variable name="option"> debug="yes" </xsl:variable>
		<xsl:variable name="optionno"> debug="no" </xsl:variable>
		<xsl:variable name="displaydebug">
			<xsl:choose>
				<xsl:when test="$xsltforms_debug != ''"><xsl:value-of select="$xsltforms_debug"/></xsl:when>
				<xsl:when test="contains(concat(' ',translate(normalize-space(/processing-instruction('xsltforms-options')[1]), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),' '),$option)">true</xsl:when>
				<xsl:when test="contains(concat(' ',translate(normalize-space(/processing-instruction('xsltforms-options')[1]), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),' '),$optionno)">false</xsl:when>
				<xsl:otherwise>false</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<head>
			<xsl:copy-of select="xhtml:head/@* | head/@*"/>
			<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
			<xsl:for-each select="xhtml:head/xhtml:meta[string(@http-equiv) != 'Content-Type'] | head/meta[string(@http-equiv) != 'Content-Type']">
				<meta>
					<xsl:copy-of select="@*"/>
				</meta>
			</xsl:for-each>
			<link type="text/css" href="{$resourcesdircss}xsltforms.css" rel="stylesheet"/>
			<xsl:apply-templates select="(xhtml:head | head)/node()[namespace-uri() != 'http://www.w3.org/2002/xforms' and local-name() != 'meta' and local-name() != 'META']"/>
			<xsl:variable name="jsrevisionname"><xsl:if test="$jsrevision = 'concat'">-1.5.5</xsl:if></xsl:variable>
			<xsl:variable name="jsrevisionparam"><xsl:if test="$jsrevision != '' and $jsrevision != 'concat'">?<xsl:value-of select="$jsrevision"/>=661</xsl:if></xsl:variable>
			<xsl:element name="{$xsltforms_replacement_for}script">
				<xsl:attribute name="type">text/javascript</xsl:attribute>
				<xsl:attribute name="id">xsltforms-src</xsl:attribute>
				<xsl:attribute name="src"><xsl:value-of select="$resourcesdirjs"/>xsltforms<xsl:value-of select="$jsrevisionname"/>.js<xsl:value-of select="$jsrevisionparam"/></xsl:attribute>
				<xsl:attribute name="data-uri">http://www.agencexml.com/xsltforms</xsl:attribute>
				<xsl:attribute name="data-version">661</xsl:attribute>
				<xsl:text>/* */</xsl:text>
			</xsl:element>
		</head>
		<body>
			<xsl:copy-of select="xhtml:body/@*[name() != 'onload'] | body/@*[name() != 'onload']"/>
			<xsl:if test="/processing-instruction('xsltforms-options')">
				<xforms-options>
					<xsl:for-each select="/processing-instruction('xsltforms-options')">
						<xsl:call-template name="getoptions">
							<xsl:with-param name="optionset" select="."/>
						</xsl:call-template>
					</xsl:for-each>
				</xforms-options>
			</xsl:if>
			<xsl:comment>XsltForms_MagicSeparator</xsl:comment>
			<xsl:apply-templates select="xhtml:head/xforms:model | head/xforms:model"/>
			<xsl:apply-templates select="xhtml:body/node() | body/node()"/>
			<xsl:comment>XsltForms_MagicSeparator</xsl:comment>
		</body>
	</html>
</xsl:template>
<xsl:template name="getoptions">
	<xsl:param name="optionset"/>
	<xsl:if test="contains($optionset, '=')">
		<xsl:variable name="oname" select="translate(substring-before($optionset, '='),' ','')"/>
		<xsl:if test="$oname != ''">
			<xsl:variable name="valsep" select="substring(translate(substring-after($optionset, '='), ' ', ''), 1, 1)"/>
			<xsl:if test="$valsep = $apos or $valsep = $quot">
				<xsl:attribute name="xf-{$oname}"><xsl:value-of select="substring-before(substring-after($optionset, $valsep), $valsep)"/></xsl:attribute>
				<xsl:call-template name="getoptions">
					<xsl:with-param name="optionset" select="substring-after(substring-after($optionset, $valsep), $valsep)"/>
				</xsl:call-template>
			</xsl:if>
		</xsl:if>
	</xsl:if>
</xsl:template>
<xsl:template match="processing-instruction()" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"/>
<xsl:template match="comment()" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"/>
<xsl:template match="text()" mode="item" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"/>
<xsl:template match="xsd:*" priority="1" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
	<xsl:element name="{$xsltforms_replacement_for}script">
	  <xsl:attribute name="type">application/xml</xsl:attribute>
		<xsl:apply-templates select="." mode="xml2string"/>
	</xsl:element>
</xsl:template>
<xsl:template match="xforms:*" priority="100" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xforms="http://www.w3.org/2002/xforms">
	<xsl:variable name="custom_name" select="concat('xforms-', local-name())"/>
	<xsl:variable name="svgparent" select="boolean(ancestor::*[namespace-uri() != 'http://www.w3.org/2002/xforms'][1][namespace-uri() = 'http://www.w3.org/2000/svg' and local-name() != 'foreignObject'])"/>
	<xsl:variable name="elt_name">
		<xsl:choose>
			<xsl:when test="$svgparent">
				<xsl:choose>
					<xsl:when xmlns:svg="http://www.w3.org/2000/svg" test="parent::svg:text | parent::svg:tspan | parent::svg:textPath">tspan</xsl:when>
					<xsl:otherwise>g</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$custom_name"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="elt_nsuri">
		<xsl:choose>
			<xsl:when test="$svgparent">http://www.w3.org/2000/svg</xsl:when>
			<xsl:otherwise>http://www.w3.org/1999/xhtml</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:choose>
		<xsl:when test="self::xforms:model">
			<xsl:element name="{$elt_name}" namespace="{$elt_nsuri}">
				<xsl:if test="$custom_name != $elt_name">
					<xsl:attribute name="xforms-name"><xsl:value-of select="local-name()"/></xsl:attribute>
				</xsl:if>
				<xsl:for-each select="@*">
					<xsl:choose>
						<xsl:when test="namespace-uri() = ''">
							<xsl:choose>
								<xsl:when test="contains(., '{')">
									<xsl:attribute name="xf-template-{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:when test="local-name() = 'id' or local-name() = 'style' or local-name() = 'class'">
									<xsl:attribute name="{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="xf-{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:when test="namespace-uri() = 'http://www.w3.org/2001/xml-events'">
							<xsl:attribute name="ev-{local-name()}">
								<xsl:value-of select="."/>
							</xsl:attribute>
						</xsl:when>
					</xsl:choose>
				</xsl:for-each>
				<xsl:apply-templates select="node()"/>
			</xsl:element>
		</xsl:when>
		<xsl:when test="self::xforms:instance">
			<xsl:element name="{$elt_name}" namespace="{$elt_nsuri}">
				<xsl:if test="$custom_name != $elt_name">
					<xsl:attribute name="xforms-name"><xsl:value-of select="local-name()"/></xsl:attribute>
				</xsl:if>
				<xsl:for-each select="@*">
					<xsl:choose>
						<xsl:when test="namespace-uri() = ''">
							<xsl:choose>
								<xsl:when test="contains(., '{')">
									<xsl:attribute name="xf-template-{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:when test="local-name() = 'id' or local-name() = 'style' or local-name() = 'class'">
									<xsl:attribute name="{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="xf-{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:when test="namespace-uri() = 'http://www.w3.org/2001/xml-events'">
							<xsl:attribute name="ev-{local-name()}">
								<xsl:value-of select="."/>
							</xsl:attribute>
						</xsl:when>
					</xsl:choose>
				</xsl:for-each>
				<xsl:choose>
					<xsl:when test="node()">
						<xsl:element name="{$xsltforms_replacement_for}script">
							<xsl:attribute name="type">
								<xsl:choose>
									<xsl:when test="@mediatype">
										<xsl:value-of select="@mediatype"/>
									</xsl:when>
									<xsl:otherwise>application/xml</xsl:otherwise>
								</xsl:choose>
							</xsl:attribute>
									<xsl:apply-templates select="node()" mode="xml2string"/>
						</xsl:element>
					</xsl:when>
					<xsl:otherwise>&#160;</xsl:otherwise>
				</xsl:choose>
			</xsl:element>
		</xsl:when>
		<xsl:when test="self::xforms:repeat and parent::*[local-name() = 'table' or local-name() = 'thead' or local-name() = 'tbody' or local-name() = 'tfoot']">
			<xsl:apply-templates select="node()"/>
		</xsl:when>
		<xsl:when test="contains('.bind.submission.itext.translation.text.group.repeat.input.output.textarea.secret.label.alert.hint.help.item.value.itemset.trigger.submit.range.upload.switch.case.select.select1.dialog.function.body.param.include.var.extension.', concat('.', local-name(), '.'))">
			<xsl:element name="{$elt_name}" namespace="{$elt_nsuri}">
				<xsl:if test="$custom_name != $elt_name">
					<xsl:attribute name="xforms-name"><xsl:value-of select="local-name()"/></xsl:attribute>
				</xsl:if>
				<xsl:if test="@*[contains(., '{')]">
					<xsl:attribute name="xf-avt"/>
				</xsl:if>
				<xsl:for-each select="@*">
					<xsl:choose>
						<xsl:when test="namespace-uri() = ''">
							<xsl:choose>
								<xsl:when test="(local-name() = 'id' or local-name() = 'style' or local-name() = 'class') and contains(., '{')">
									<xsl:attribute name="xf-template-{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:when test="local-name() = 'id' or local-name() = 'style' or local-name() = 'class'">
									<xsl:attribute name="{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:when test="local-name() = 'nodeset'">
									<xsl:attribute name="xf-ref">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="xf-{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:when test="namespace-uri() = 'http://www.w3.org/2001/xml-events'">
							<xsl:attribute name="ev-{local-name()}">
								<xsl:value-of select="."/>
							</xsl:attribute>
						</xsl:when>
						<xsl:when test="namespace-uri() = 'http://www.agencexml.com/meta'">
							<xsl:attribute name="meta-{local-name()}">
								<xsl:value-of select="."/>
							</xsl:attribute>
						</xsl:when>
					</xsl:choose>
				</xsl:for-each>
				<xsl:apply-templates select="node()"/>
			</xsl:element>
		</xsl:when>
		<xsl:when test="contains('.setvalue.insert.delete.update.dispatch.property.targetid.name.action.load.toggle.send.setfocus.wrap.setselection.setindex.setnode.reset.retain.return.renew.refresh.rebuild.recalculate.revalidate.unload.hint.alert.help.value.item.itemset.copy.choices.filename.show.hide.method.resource.header.mediatype.message.control.', concat('.', local-name(), '.'))">
			<xsl:element name="{$elt_name}" namespace="{$elt_nsuri}">
				<xsl:if test="$custom_name != $elt_name">
					<xsl:attribute name="xforms-name"><xsl:value-of select="local-name()"/></xsl:attribute>
				</xsl:if>
				<xsl:for-each select="@*">
					<xsl:choose>
						<xsl:when test="namespace-uri() = ''">
							<xsl:choose>
								<xsl:when test="contains(., '{')">
									<xsl:attribute name="xf-template-{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:when test="local-name() = 'id' or local-name() = 'style' or local-name() = 'class'">
									<xsl:attribute name="{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:when test="local-name() = 'nodeset'">
									<xsl:attribute name="xf-ref">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="xf-{local-name()}">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:when test="namespace-uri() = 'http://www.w3.org/2001/xml-events'">
							<xsl:attribute name="ev-{local-name()}">
								<xsl:value-of select="."/>
							</xsl:attribute>
						</xsl:when>
					</xsl:choose>
				</xsl:for-each>
				<xsl:apply-templates select="node()"/>
			</xsl:element>
		</xsl:when>
		<xsl:otherwise>
			<xsl:element name="{$xsltforms_replacement_for}script">
				<xsl:attribute name="type">text/javascript</xsl:attribute>
				<xsl:text>XsltForms_browser.dialog.hide('statusPanel');
</xsl:text>
				<xsl:text>if (!XsltForms_globals.debugMode) {
</xsl:text>
				<xsl:text>XsltForms_globals.debugMode = true;
</xsl:text>
				<xsl:text>XsltForms_globals.debugging();
</xsl:text>
				<xsl:text>}
</xsl:text>
				<xsl:text>alert("XSLTForms Exception\n--------------------------\n\nError initializing :\n\nxforms:</xsl:text>
				<xsl:value-of select="local-name()"/>
				<xsl:text> is not supported");
</xsl:text>
			</xsl:element>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>
<xsl:template match="ajx:start|ajx:stop" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ajx="http://www.ajaxforms.net/2006/ajx"/>
<xsl:template match="xhtml:br | br" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xhtml="http://www.w3.org/1999/xhtml"><br xmlns=""/></xsl:template>
<xsl:template match="text()[normalize-space(.)='']" priority="-1" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"/>
<xsl:template match="*" priority="-2" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xforms="http://www.w3.org/2002/xforms" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:choose>
		<xsl:when test="namespace-uri() != '' and namespace-uri() != 'http://www.w3.org/1999/xhtml'">
			<xsl:element name="{local-name()}" namespace="{namespace-uri()}">
				<xsl:if test="@*[contains(., '{')]">
					<xsl:attribute name="xf-avt"/>
				</xsl:if>
				<xsl:apply-templates select="@*"/>
				<xsl:apply-templates select="node()"/>
			</xsl:element>
		</xsl:when>
		<xsl:otherwise>
			<xsl:element name="{local-name()}">
				<xsl:if test="@*[contains(., '{')]">
					<xsl:attribute name="xf-avt"/>
				</xsl:if>
				<xsl:apply-templates select="@*"/>
				<xsl:if test="(local-name() = 'table' or local-name() = 'thead' or local-name() = 'tbody' or local-name() = 'tfoot') and xforms:repeat">
					<xsl:for-each select="xforms:repeat/@*">
						<xsl:variable name="aname">
							<xsl:choose>
								<xsl:when test="local-name() = 'id'">id</xsl:when>
								<xsl:when test="local-name() = 'nodeset'">xf-repeat-ref</xsl:when>
								<xsl:otherwise><xsl:value-of select="concat('xf-repeat-', local-name())"/></xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
						<xsl:attribute name="{$aname}"><xsl:value-of select="."/></xsl:attribute>
					</xsl:for-each>
				</xsl:if>
				<xsl:apply-templates select="node()"/>
			</xsl:element>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>
<xsl:template match="@*" priority="-2" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:choose>
		<xsl:when test="contains(., '{')">
			<xsl:attribute name="xf-template-{local-name()}">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:when>
		<xsl:otherwise>
			<xsl:copy/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>
<xsl:template match="node()" priority="-3" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:copy>
		<xsl:apply-templates select="node()"/>
	</xsl:copy>
</xsl:template>
<xsl:template match="processing-instruction()" mode="xml2string" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:text>&lt;?</xsl:text> 
	<xsl:value-of select="name()"/> 
	<xsl:text> </xsl:text> 
	<xsl:call-template name="escapeEntities">
		<xsl:with-param name="text" select="."/>
		<xsl:with-param name="trtext" select="translate(., $trEntities1, $trEntities2)"/>
	</xsl:call-template>
	<xsl:text>?&gt;</xsl:text>
</xsl:template>
<xsl:template match="comment()" mode="xml2string" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:text>&lt;!--</xsl:text>
	<xsl:call-template name="escapeEntities">
		<xsl:with-param name="text" select="."/>
		<xsl:with-param name="trtext" select="translate(., $trEntities1, $trEntities2)"/>
	</xsl:call-template>
	<xsl:text>--&gt;</xsl:text>
</xsl:template>
<xsl:template match="*" mode="xml2string" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="root"/>
	<xsl:text>&lt;</xsl:text>
	<xsl:value-of select="name()"/>
	<xsl:variable name="parent" select=".."/>
	<xsl:variable name="element" select="."/>
			<xsl:variable name="prefixes"><xsl:for-each select="(. | @*)[name() != local-name() and not(starts-with(name(), 'xml:'))]"><xsl:sort select="substring-before(name(),':')"/><xsl:value-of select="substring-before(name(),':')"/>:<xsl:value-of select="namespace-uri()"/>|</xsl:for-each></xsl:variable>
			<xsl:call-template name="nmdecls"><xsl:with-param name="pfs" select="$prefixes"/></xsl:call-template>
			<xsl:if test="name() = local-name() and ($root or namespace-uri() != namespace-uri($parent))"> xmlns="<xsl:value-of select="namespace-uri()"/>"</xsl:if>
	<xsl:apply-templates select="@*" mode="xml2string"/>
	<xsl:choose>
		<xsl:when test="node()">&gt;<xsl:apply-templates select="node()" mode="xml2string"><xsl:with-param name="root" select="false()"/></xsl:apply-templates>&lt;<xsl:if test="name() = 'script'">\</xsl:if>/<xsl:value-of select="name()"/>&gt;</xsl:when>
		<xsl:otherwise>/&gt;</xsl:otherwise>
	</xsl:choose>
	<xsl:text/>
</xsl:template>
<xsl:template match="text()" mode="xml2string" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:if test="normalize-space(.)!=''"><xsl:call-template name="escapeEntities"><xsl:with-param name="text" select="."/><xsl:with-param name="trtext" select="translate(., $trEntities1, $trEntities2)"/></xsl:call-template></xsl:if>
</xsl:template>
<xsl:template match="@*" mode="xml2string" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:text> </xsl:text>
	<xsl:value-of select="name()"/>
	<xsl:text>="</xsl:text>
	<xsl:call-template name="escapeEntities">
		<xsl:with-param name="text" select="."/>
		<xsl:with-param name="trtext" select="translate(., $trEntities1, $trEntities2)"/>
	</xsl:call-template>
	<xsl:text>"</xsl:text>
</xsl:template>
<xsl:variable name="trEntities1" select="concat($amp,$apos,$lt,$gt,$quot)" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"/>
<xsl:variable name="trEntities2" select="concat($tab,$tab,$tab,$tab,$tab)" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"/>
<xsl:template name="escapeEntities" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="text"/>
	<xsl:param name="trtext"/>
	<xsl:choose>
		<xsl:when test="function-available('msxsl:node-set') and contains($trtext, '&#9;')">
			<xsl:value-of select="substring-before($trtext, '&#9;')"/>
			<xsl:variable name="c" select="substring($text, string-length(substring-before($trtext, '&#9;'))+1, 1)"/>
			<xsl:choose>
				<xsl:when test="$c = $amp">&amp;amp;</xsl:when>
				<xsl:when test="$c = $apos">&amp;apos;</xsl:when>
				<xsl:when test="$c = $lt">&amp;lt;</xsl:when>
				<xsl:when test="$c = $gt">&amp;gt;</xsl:when>
				<xsl:when test="$c = $quot">&amp;quot;</xsl:when>
				<xsl:when test="$c = $backslash">\\</xsl:when>
				<xsl:when test="$c = $newline">&amp;#10;</xsl:when>
				<xsl:when test="$c = $lineseparator">&amp;#10;</xsl:when>
				<xsl:when test="$c = $carriagereturn">&amp;#13;</xsl:when>
				<xsl:when test="$c = '&#9;'">&#9;</xsl:when>
			</xsl:choose>
			<xsl:variable name="text2" select="substring-after($text, $c)"/>
			<xsl:variable name="trtext2" select="substring-after($trtext, '&#9;')"/>
			<xsl:variable name="text3" select="substring($text2, 1, string-length($text2) div 2)"/>
			<xsl:variable name="trtext3" select="substring($trtext2, 1, string-length($trtext2) div 2)"/>
			<xsl:variable name="text4" select="substring($text2, string-length($text2) div 2 + 1)"/>
			<xsl:variable name="trtext4" select="substring($trtext2, string-length($trtext2) div 2 + 1)"/>
			<xsl:call-template name="escapeEntities">
				<xsl:with-param name="text" select="$text3"/>
				<xsl:with-param name="trtext" select="$trtext3"/>
			</xsl:call-template>
			<xsl:call-template name="escapeEntities">
				<xsl:with-param name="text" select="$text4"/>
				<xsl:with-param name="trtext" select="$trtext4"/>
			</xsl:call-template>
		</xsl:when>
		<xsl:when test="not(function-available('msxsl:node-set')) and contains($trtext, $tab)">
			<xsl:value-of select="substring-before($trtext, $tab)"/>
			<xsl:variable name="c" select="substring($text, string-length(substring-before($trtext, $tab))+1, 1)"/>
			<xsl:choose>
				<xsl:when test="$c = $amp">&amp;amp;</xsl:when>
				<xsl:when test="$c = $apos">&amp;apos;</xsl:when>
				<xsl:when test="$c = $lt">&amp;lt;</xsl:when>
				<xsl:when test="$c = $gt">&amp;gt;</xsl:when>
				<xsl:when test="$c = $quot">&amp;quot;</xsl:when>
				<xsl:when test="$c = $backslash">\\</xsl:when>
				<xsl:when test="$c = $newline">&amp;#10;</xsl:when>
				<xsl:when test="$c = $lineseparator">&amp;#10;</xsl:when>
				<xsl:when test="$c = $carriagereturn">&amp;#13;</xsl:when>
				<xsl:when test="$c = $tab">&#9;</xsl:when>
			</xsl:choose>
			<xsl:variable name="text2" select="substring-after($text, $c)"/>
			<xsl:variable name="trtext2" select="substring-after($trtext, $tab)"/>
			<xsl:variable name="text3" select="substring($text2, 1, string-length($text2) div 2)"/>
			<xsl:variable name="trtext3" select="substring($trtext2, 1, string-length($trtext2) div 2)"/>
			<xsl:variable name="text4" select="substring($text2, string-length($text2) div 2 + 1)"/>
			<xsl:variable name="trtext4" select="substring($trtext2, string-length($trtext2) div 2 + 1)"/>
			<xsl:call-template name="escapeEntities">
				<xsl:with-param name="text" select="$text3"/>
				<xsl:with-param name="trtext" select="$trtext3"/>
			</xsl:call-template>
			<xsl:call-template name="escapeEntities">
				<xsl:with-param name="text" select="$text4"/>
				<xsl:with-param name="trtext" select="$trtext4"/>
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="$text"/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>
<xsl:template name="nmdecls" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="prev"/>
	<xsl:param name="pfs"/>
	<xsl:if test="contains($pfs, '|')">
		<xsl:variable name="prev2" select="substring-before($pfs,':')"/>
		<xsl:if test="$prev2 != $prev"> xmlns:<xsl:value-of select="$prev2"/>="<xsl:value-of select="substring-before(substring-after($pfs,':'),'|')"/>"</xsl:if>
		<xsl:call-template name="nmdecls">
			<xsl:with-param name="prev" select="$prev2"/>
			<xsl:with-param name="pfs" select="substring-after($pfs, '|')"/>
		</xsl:call-template>
	</xsl:if>
</xsl:template>

</xsl:stylesheet>