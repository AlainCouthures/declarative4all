processing-instruction xml-stylesheet {'href="xsl/xsltforms.xsl" type="text/xsl"'},
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:xf="http://www.w3.org/2002/xforms" xmlns:regexp="http://exslt.org/regular-expressions" xmlns:ev="http://www.w3.org/2001/xml-events">
	<head>
		<title>WakeOnLan</title>
		<style type="text/css">
			#selection .xforms-value {{width:50ex}}
		</style>
		<xf:model>
			<xf:instance id="vars">
				<vars xmlns="">
					<selection/>
					<calculatedselection/>
					<pccount/>
					<selectedgroups/>
					<groups>
						<group name="Postes administratifs">ADMIN-.*</group>
						<group name="Laboratoire">LABO-.*</group>
						<group name="Salle CDI">CDI-A.*</group>
						<group name="Documentalistes">CDI-B.*</group>
					</groups>
				</vars>
			</xf:instance>
			<xf:instance id="pcs">{
				let $m := fn:doc('../private/collect.json')/map()
				return <pcs xmlns="">{
					for $pc in $m/entry()
					return <pc>{
						local-name($pc)
					}</pc>
				}</pcs>
			}</xf:instance>
			<xf:bind ref="instance('vars')/pccount" calculate="count(instance('pcs')/pc[regexp:match(., concat('^(', instance('vars')/selection, '|', instance('vars')/calculatedselection, ')$'), 'i')])" readonly=". = 0"/>
		</xf:model>
	</head>
	<body>
		<h2>Actions group&eacute;es sur postes</h2>
		<xf:output value="choose(instance('vars')/pccount = 0, 'Aucun poste s&eacute;lectionn&eacute;',choose(instance('vars')/pccount = 1, '1 poste s&eacute;lectionn&eacute;', concat(instance('vars')/pccount, ' postes s&eacute;lectionn&eacute;s')))"/>
		<br/>
		<br/>
		<xf:trigger ref="instance('vars')/pccount">
			<xf:label>R&eacute;veiller</xf:label>
		</xf:trigger>
		<br/>
		<br/>
		<table>
			<tr>
				<td>Noms des postes concern&eacute;s :</td>
				<td><xf:input id="selection" ref="instance('vars')/selection" incremental="true"/></td>
			</tr>
			<tr>
				<td style="text-align:right;">&nbsp;<xf:output value="choose(instance('vars')/selectedgroups != '', 'et', '')"/></td>
				<td><xf:output value="translate(instance('vars')/selectedgroups, ' ', '|')"/></td>
			</tr>
		</table>
		<xf:select ref="instance('vars')/selectedgroups" appearance="full">
			<xf:itemset ref="instance('vars')/groups/group">
				<xf:label ref="@name"/>
				<xf:value ref="."/>
			</xf:itemset>
			<xf:setvalue ev:event="xforms-value-changed" ref="instance('vars')/calculatedselection" value="translate(instance('vars')/selectedgroups, ' ', '|')"/>
		</xf:select>
	</body>
</html>