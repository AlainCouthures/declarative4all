<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xqx="http://www.w3.org/2005/XQueryX"
                xmlns:xqxuf="http://www.w3.org/2007/xquery-update-10"
                xmlns:xqxsx="http://www.w3.org/2008/xquery-sx-10">

<!-- Initial creation                  2008-03-01: Jim Melton -->
<!-- Reviewed, cleaned, corrections    2009-08-17: Jim Melton -->
<!-- Updated to recent grammar changes 2010-02-15: Jim Melton -->

<xsl:import href="http://www.w3.org/2007/xquery-update-10/xquery-update-10-xqueryx.xsl"/>


<!-- constDecl                                                -->
<!-- 2010-02-15: "constant" is now "unassignable variable"    -->
<xsl:template match="xqxsx:constDecl">
  <xsl:value-of select="$NEWLINE"/>
  <xsl:text>declare unassignable variable </xsl:text>
  <xsl:apply-templates/>
</xsl:template>

<xsl:template match="xqxsx:constName">
  <xsl:apply-templates/>
</xsl:template>


<!-- Over-ride the template for varDecl in XQueryX.xsd        -->
<!-- 2010-02-15: "variable" is now "assignable variable"      -->
  <xsl:template match="xqx:varDecl" priority="200">
    <xsl:text>declare assignable variable </xsl:text>
    <xsl:value-of select="$DOLLAR"/>
    <xsl:apply-templates select="xqx:varName"/>
    <xsl:apply-templates select="xqx:typeDeclaration"/>
    <xsl:if test="xqx:external">
      <xsl:text> external </xsl:text>
    </xsl:if>
    <xsl:if test="xqx:varValue">
      <xsl:value-of select="$ASSIGN"/>
      <xsl:apply-templates select="xqx:varValue"/>
    </xsl:if>
  </xsl:template>


<!-- assignmentExpr                                           -->
<!-- 2010-02-15: Remove 'set' keyword                         -->
<xsl:template match="xqxsx:assignmentExpr">
  <xsl:value-of select="$NEWLINE"/>
  <xsl:apply-templates select="xqx:positionalVariableBinding"/>
  <xsl:text> := </xsl:text>
  <xsl:apply-templates/>
</xsl:template>

<xsl:template match="xqxsx:assignedExpr">
  <xsl:apply-templates/>
</xsl:template>


<!-- block                                                    -->
<!-- 2010-02-15: Added 'block' keyword                        -->
<xsl:template match="xqxsx:block">
  <xsl:value-of select="$NEWLINE"/>
  <xsl:text>block </xsl:text>
  <xsl:value-of select="$LBRACE"/>
  <xsl:value-of select="$SPACE"/>
  <xsl:apply-templates/>
  <xsl:value-of select="$SPACE"/>
  <xsl:value-of select="$RBRACE"/>
  <xsl:value-of select="$SPACE"/>
</xsl:template>

<!-- blockVarDecl                                             -->
<xsl:template match="xqxsx:blockVarDecl[position()=1 and position()=last()]">
  <xsl:text>declare </xsl:text>
  <xsl:apply-templates select="xqxsx:varName"/>
  <xsl:if test="xqx:typeDeclaration">
    <xsl:apply-templates select="xqx:typeDeclaration"/>
  </xsl:if>
  <xsl:if test="xqxsx:varValue">
    <xsl:text> := </xsl:text>
    <xsl:apply-templates select="xqxsx:varValue"/>
  </xsl:if>
  <xsl:value-of select="$SEMICOLON"/>
</xsl:template>

<xsl:template match="xqxsx:blockVarDecl[position()=1 and position()!=last()]">
  <xsl:text>declare </xsl:text>
  <xsl:apply-templates select="xqxsx:varName"/>
  <xsl:if test="xqx:typeDeclaration">
    <xsl:apply-templates select="xqx:typeDeclaration"/>
  </xsl:if>
  <xsl:if test="xqxsx:varValue">
    <xsl:text> := </xsl:text>
    <xsl:apply-templates select="xqxsx:varValue"/>
  </xsl:if>
</xsl:template>

<xsl:template match="xqxsx:blockVarDecl[position()>1 and position()&lt;last()]">
  <xsl:value-of select="$COMMA"/>
  <xsl:value-of select="$NEWLINE"/>
  <xsl:apply-templates select="xqxsx:varName"/>
  <xsl:if test="xqx:typeDeclaration">
    <xsl:apply-templates select="xqx:typeDeclaration"/>
  </xsl:if>
  <xsl:if test="xqxsx:varValue">
    <xsl:text> := </xsl:text>
    <xsl:apply-templates select="xqxsx:varValue"/>
  </xsl:if>
</xsl:template>

<xsl:template match="xqxsx:blockVarDecl[position()>1 and position()=last()]">
  <xsl:value-of select="$COMMA"/>
  <xsl:value-of select="$NEWLINE"/>
  <xsl:apply-templates select="xqxsx:varName"/>
  <xsl:if test="xqx:typeDeclaration">
    <xsl:apply-templates select="xqx:typeDeclaration"/>
  </xsl:if>
  <xsl:if test="xqxsx:varValue">
    <xsl:text> := </xsl:text>
    <xsl:apply-templates select="xqxsx:varValue"/>
  </xsl:if>
  <xsl:value-of select="$SEMICOLON"/>
</xsl:template>

<xsl:template match="xqxsx:varName">
  <xsl:apply-templates/>
</xsl:template>

<xsl:template match="xqxsx:varValue">
  <xsl:apply-templates/>
</xsl:template>

<!-- blockBody                                                -->
<xsl:template match="xqxsx:blockBody">
  <xsl:apply-templates/>
</xsl:template>

<xsl:template match="xqxsx:blockExpr">
  <xsl:apply-templates/>
</xsl:template>


<!-- exitExpr                                          -->
<xsl:template match="xqxsx:exitExpr">
  <xsl:value-of select="$NEWLINE"/>
  <xsl:text>exit returning </xsl:text>
  <xsl:apply-templates/>
</xsl:template>


<!-- whileExpr                                                -->
<xsl:template match="xqxsx:whileExpr">
  <xsl:value-of select="$NEWLINE"/>
  <xsl:text>while </xsl:text>
  <xsl:value-of select="$LPAREN"/>
  <xsl:value-of select="$SPACE"/>
  <xsl:apply-templates select="xqxsx:whileTest"/>
  <xsl:value-of select="$SPACE"/>
  <xsl:value-of select="$RPAREN"/>
  <xsl:value-of select="$NEWLINE"/>
  <xsl:apply-templates select="xqxsx:block"/>
  <xsl:value-of select="$NEWLINE"/>
</xsl:template>

<xsl:template match="xqxsx:whileTest">
  <xsl:apply-templates/>
</xsl:template>


<!-- applyExpr                                                -->
<xsl:template match="xqxsx:applyExpr">
  <xsl:value-of select="$NEWLINE"/>
  <xsl:apply-templates select="xqxsx:concatExpr"/>
  <xsl:value-of select="$NEWLINE"/>
</xsl:template>

<xsl:template match="xqxsx:concatExpr">
  <xsl:apply-templates/>
  <xsl:value-of select="$SEMICOLON"/>
</xsl:template>


<!-- Over-ride the template for functionDecl in XQuery        -->
<!--   Update Facility xquery-update-10-xqueryx.xsl           -->
  <xsl:template match="xqx:functionDecl" priority="200">
    <xsl:text>declare </xsl:text>
    <xsl:choose>
      <xsl:when test="@xqx:updatingFunction and
                      @xqx:updatingFunction = 'true'">
        <xsl:text>updating </xsl:text>
      </xsl:when>
      <xsl:when test="@xqx:sequentialFunction and
                      @xqx:sequentialFunction = 'true'">
        <xsl:text>sequential </xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:text>simple </xsl:text>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:text>function </xsl:text>
    <xsl:apply-templates select="xqx:functionName"/>
    <xsl:apply-templates select="xqx:paramList"/>
    <xsl:apply-templates select="xqx:typeDeclaration"/>
    <xsl:apply-templates select="xqx:functionBody"/>
    <xsl:if test="xqx:externalDefinition">
      <xsl:text> external </xsl:text>
    </xsl:if>
  </xsl:template>



</xsl:stylesheet>
