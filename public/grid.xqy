declare function local:setattr($name, $value) {
	let $esc := replace(replace(replace(replace(replace($value, '&amp;', '&amp;amp;'), '&lt;', '&amp;lt;'), '&gt;', '&amp;gt;'), '&quot;', '&amp;quot;'), "&apos;", '&amp;apos;')
	return if ($value ne '') then (if (contains($esc, '&amp;quot;')) then (' ' + $name + "='" + $esc + "'") else (' ' + $name + '="' + $esc + '"')) else ''
};
declare function local:attrs() {
	local:setattr("name", ?name) +
	local:setattr("label", ?label) +
	local:setattr("hint", ?hint) +
	local:setattr("calculation", ?calculation) +
	local:setattr("appearance", if (?type eq 'begin_group' and ?appearance ne '') then ('collapsed ' + ?appearance) else ?appearance) +
	local:setattr("relevant", ?relevant) +
	local:setattr("constraint", ?constraint) +
	local:setattr("constraint_message", ?constraint_message) +
	local:setattr("readonly", if (?type eq 'note') then 'true' else ?readonly) +
	local:setattr("required", ?required)
};
declare function local:attrs_choices() {
	local:setattr("list_name", ?list_name) +
	local:setattr("list_name", ?('list name')) +
	local:setattr("name", ?name) +
	local:setattr("label", ?label) +
	local:setattr("image", ?image)
};
declare function local:attrs_settings() {
	local:setattr("form_title", ?form_title) +
	local:setattr("form_title", ?title) +
	local:setattr("form_id", ?form_id) +
	local:setattr("default_language", ?default_language)
};
let $book := doc('public/grid.xlsx')
let $root := 'grid'
let $survey := excel:values($book, "survey!", (), true())
let $choices := excel:values($book, "choices!", (), true())
let $settings := excel:values($book, "settings!", (), true())
let $xlsform := '<xlsform>' +
	'<survey>' + string-join(matrix:transpose($survey !! (
	if (?type eq '') then '' else
	if (?type eq 'begin_group') then ('<group' + (if (?appearance eq '') then ' appearance="collapsed"' else '') + local:attrs() + '>') else
	if (?type eq 'end_group') then '</group>' else
	if (starts-with(?type, 'select_one ')) then ('<select_one choices="' + substring-after(?type, 'select_one ') + '"' + local:attrs() + '/>') else
	if (starts-with(?type, 'select_multiple ')) then ('<select_multiple choices="' + substring-after(?type, 'select_multiple ') + '"' + local:attrs() + '/>') else
	('<' + ?type + local:attrs() + '/>')))) +
	'</survey>' +
	'<choices>' + string-join(matrix:transpose($choices !! (
	if (?('list name') eq '') then '' else
	('<choice' + local:attrs_choices() + '/>')))) +
	'</choices>' +
	'<settings>' + string-join(matrix:transpose($settings !!
	('<setting' + local:attrs_settings() + '/>'))) +
	'</settings>' +
	'</xlsform>'
let $doc := parse-xml($xlsform)
let $leaf := function($n) {
	element {$n/@name} {}
}
let $subtree := function($n, $t, $l) {
	element {$n/@name} {
		$n/* ! (if (name(current()) eq 'group') then $t(current(), $t, $l) else $l(current()))
	}
}
let $begin := '${'
let $end := '}'
let $refconv := function($n, $s, $b, $e, $f, $g, $r) {
	if (contains($s, $b)) then (substring-before($s, $b) + ' ' + $g($n, substring-before(substring-after($s, $b), $e), $r) + ' ' + $f($n, substring-after($s, $e), $b, $e, $f, $g, $r)) else $s
}
let $refpath := function($n, $name, $r) {
	let $target := $n/ancestor::survey//*[string(@name) eq $name]
	return '/' + string-join(($r, (reverse($target/ancestor-or-self::*[@name]) ! string(@name))), '/')
}
let $bind := function($n, $b, $e, $f, $g, $r) {
	if (name($n) eq 'group') then () else (
		let $type := (if (name($n) = ('text', 'note', 'select_one', 'select_multiple')) then () else attribute type {'xsd:' + name($n)})
		let $xpattrs := $n ! (@required, @readonly, @relevant) ! attribute {name()} {if (string(.) eq 'true') then 'true()' else $f(., string(.), $b, $e, $f, $g, $r)}
		let $battrs := ($type, $xpattrs)
		return if ($battrs) then <xf:bind ref="{'/' + string-join(($r, (reverse($n/ancestor-or-self::*[@name]) ! string(@name))), '/')}">{$battrs}</xf:bind> else ()
	)
}
let $model := <xf:model>
	<xf:instance xmlns="">
		{element {$root}
			{($doc/xlsform/survey/* ! (if (name(current()) eq 'group') then $subtree(current(), $subtree, $leaf) else $leaf(current())),
			<meta>
				<instanceID/>
			</meta>)}
		}
	</xf:instance>
	{$doc/xlsform/survey//* ! $bind(current(), $begin, $end, $refconv, $refpath, $root)}
</xf:model>
let $input := function($n, $r) {
	<xf:input ref="{'/' + string-join(($r, (reverse($n/ancestor-or-self::*[@name]) ! string(@name))), '/')}">
		{$n/@appearance}
		{if ($n/@label ne '') then <xf:label mediatype="text/markdown">{$n/@label/text()}</xf:label> else ()}
		{if ($n/@hint ne '') then <xf:hint mediatype="text/markdown">{$n/@hint/text()}</xf:hint> else ()}
	</xf:input>
}
let $templates := map {
	'group': function($n, $m, $i, $r) {
			<xf:group ref="{'/' + string-join(($r, (reverse($n/ancestor-or-self::*[@name]) ! string(@name))), '/')}">
				{$n/@appearance}
				{if ($n/@label ne '') then <xf:label mediatype="text/markdown">{$n/@label/text()}</xf:label> else ()}
				{$n/* ! (if ($m?(name(current()))) then $m?(name(current()))(current(), $m, $i, $r) else $i(current(), $r))}
			</xf:group>
		},
	'note': function($n, $m, $i, $r) {
			<xf:output ref="{'/' + string-join(($r, (reverse($n/ancestor-or-self::*[@name]) ! string(@name))), '/')}">
				{$n/@appearance}
				{if ($n/@label ne '') then <xf:label mediatype="text/markdown">{$n/@label/text()}</xf:label> else ()}
				{if ($n/@hint ne '') then <xf:hint>{$n/@hint/text()}</xf:hint> else ()}
			</xf:output>
		},
	'select_one': function($n, $m, $i, $r) {
			<xf:select1 ref="{'/' + string-join(($r, (reverse($n/ancestor-or-self::*[@name]) ! string(@name))), '/')}">
				{$n/@appearance}
				{if ($n/@label ne '') then <xf:label mediatype="text/markdown">{$n/@label/text()}</xf:label> else ()}
				{if ($n/@hint ne '') then <xf:hint>{$n/@hint/text()}</xf:hint> else ()}
				{$n/ancestor::xlsform/choices/choice[string(@list_name) eq string($n/@choices)] ! <xf:item><xf:label>{@label/text()}</xf:label><xf:value>{@name/text()}</xf:value></xf:item>}
			</xf:select1>
		},
	'select_multiple': function($n, $m, $i, $r) {
			<xf:select ref="{'/' + string-join(($r, (reverse($n/ancestor-or-self::*[@name]) ! string(@name))), '/')}">
				{$n/@appearance}
				{if ($n/@label ne '') then <xf:label mediatype="text/markdown">{$n/@label/text()}</xf:label> else ()}
				{if ($n/@hint ne '') then <xf:hint mediatype="text/markdown">{$n/@hint/text()}</xf:hint> else ()}
				{$n/ancestor::xlsform/choices/choice[string(@list_name) eq string($n/@choices)] ! <xf:item><xf:label>{@label/text()}</xf:label><xf:value>{@name/text()}</xf:value></xf:item>}
			</xf:select>
		}
}
let $view := $doc/xlsform/survey/* ! (if ($templates?(name(current()))) then $templates?(name(current()))(current(), $templates, $input, $root) else $input(current(), $root))
let $form := document {(processing-instruction xml-stylesheet {'href="xsl/xsltforms.xsl" type="text/xsl"'},
	<html xmlns="http://www.w3.org/1999/xhtml" xmlns:xf="http://www.w3.org/2002/xforms" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><head><title>{data($doc/xlsform/settings/setting/@form_title)}</title>{$model}</head><body>{$view}</body></html>)}
let $result := parse-xml(serialize($form, map{'indent': 'yes'}))
return $result