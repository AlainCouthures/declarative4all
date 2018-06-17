<html>
	<head>
		<title>R&eacute;partition R&eacute;seau</title>
		<style>
			body {{
				font-family: arial,sans-serif;
				font-size: 80%;
			}}
			table {{
				border-collapse: collapse;
			}}
			table, th, td {{
				border: 1px solid black;
			}}
		</style>
	</head>
	{
		let $m := fn:doc('../private/collect.json')?*
		let $vlans := fn:doc('../private/vlans.json')?*
		let $switches := fn:doc('../private/switches.json')?*
		let $total := fn:count($m)
		let $totalPC := fn:count($m[?version])
		let $totalVLAN := fn:count($m[?ip and ?ip ne ''])
		let $totalSwitch := fn:count($m[?switch])
		return <body>
			<p>{
				fn:format-dateTime(file:last-modified('../private/collect.json'), '[h01]:[m01]:[s01] [D]/[M]/[Y,2-2]') || ' - ' || $totalPC || ' ordinateurs, ' || ($total - $totalPC) || ' &eacute;quipements dans l''inventaire'
			}</p>
			<h1>R&eacute;partition VLAN ({$totalVLAN} / {$total})</h1>
			<table>
				<tr><td>absent</td><td>{
					fn:sort($m[?ip eq '' and not(starts-with(local-name(), '#'))] ! local-name())
				}</td></tr>
				{
				for $v in $vlans
				return <tr><td style="white-space: nowrap;">{local-name($v)}</td><td>{
					fn:sort($m[ietf:on-subnet(ietf:ipv4(?ip),ietf:ipv4($v?mask),ietf:ipv4($v?subnet))] ! local-name())
				}</td></tr>
			}</table>
			<h1>R&eacute;partition switchs ({$totalSwitch} / {$total})</h1>
			<table>
				<tr><td colspan="2">inconnu</td><td>{
					fn:sort($m[not(?switch)] ! local-name())
				}</td></tr>
				{
				for $v0 in $switches
				let $ports0 := fn:sort(fn:distinct-values($m[?switch eq local-name($v0)] ! ?port))
				let $ports1 := (for $p in $ports0
					return if (contains($p, '/')) then (
						let $letter := translate($p, '0123456789/', '')
						let $num := '0' || substring-after($p, '/' || $letter)
						return substring-before($p, '/') || $letter || substring($num, string-length($num) - 1) || '-' || $p
					) else (
						let $num := '0' || $p
						return substring($num, string-length($num) - 1) || '-' || $p
					)
				)
				let $ports := fn:sort($ports1) ! substring-after(., '-')
				for $v in $ports
				return <tr>{if ($v eq head($ports)) then <td style="white-space: nowrap;" rowspan="{xs:string(fn:count($ports))}">{local-name($v0)}</td> else ()}<td>{$v}</td><td>{
					fn:sort($m[?switch eq local-name($v0) and ?port eq $v] ! local-name())
				}</td></tr>
			}</table>
		</body>
	}
</html>