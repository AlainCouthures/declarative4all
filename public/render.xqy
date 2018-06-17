<html>
	<head>
		<title>R&eacute;partition Inventaire</title>
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
		let $m := fn:doc('public/aruba/collect.json')?*
		let $vlans := fn:doc('public/aruba/vlans.json')?*
		let $switches := fn:doc('public/aruba/switches.json')?*
		let $total := fn:count($m)
		let $totalPC := fn:count($m[?version])
		let $totalOffice := fn:count($m[?office])
		let $totalVLAN := fn:count($m[?ip and ?ip ne ''])
		let $totalSwitch := fn:count($m[?switch])
		let $totalSpectre := fn:count($m[?spectre])
		return <body>
			<p>{
				fn:format-dateTime(file:last-modified('public/aruba/collect.json'), '[h01]:[m01]:[s01] [D]/[M]/[Y,2-2]') || ' - ' || $totalPC || ' ordinateurs, ' || ($total - $totalPC) || ' &eacute;quipements dans l''inventaire'
			}</p>
			<h1>R&eacute;partition Windows ({$totalPC})</h1>
			<table>{
				for $v in fn:sort(fn:distinct-values($m?version))
				return <tr><td>{$v}</td><td>{
					fn:sort($m[?version eq $v] ! local-name())
				}</td></tr>
			}</table>
			<h1>R&eacute;partition Office ({$totalOffice} / {$totalPC})</h1>
			<table>
				<tr><td>absent</td><td>{
					fn:sort($m[not(?office) and ?version] ! local-name())
				}</td></tr>
				{
				for $v in fn:sort(fn:distinct-values($m?office))
				return <tr><td>{$v}</td><td>{
					fn:sort($m[?office eq $v] ! local-name())
				}</td></tr>
			}</table>
			<h1>R&eacute;partition VLAN ({$totalVLAN} / {$total})</h1>
			<table>
				<tr><td>absent</td><td>{
					fn:sort($m[?ip eq ''] ! local-name())
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
			<h1>R&eacute;partition Spectre-Meltdown ({$totalSpectre} / {$totalPC})</h1>
			<table>
				<tr><td>inconnu</td><td>{
					fn:sort($m[not(?spectre) and ?version] ! local-name())
				}</td></tr>
				<tr><td>OK</td><td>{
					fn:sort($m[?spectre eq '0'] ! local-name())
				}</td></tr>
				<tr><td>Vuln&eacute;rable</td><td>{
					fn:sort($m[?spectre = ('12', '8', '4')] ! local-name())
				}</td></tr>
				{
				let $errcodes := map {"3":"Pb Windows", "48":"Pb mat&eacute;riel", "192":"Protection d&eacute;sactiv&eacute;e"}
				for $v in (xs:positiveInteger(3), xs:positiveInteger(48), xs:positiveInteger(192))
				return <tr><td>{xs:string($errcodes?(xs:string($v)))}</td><td>{
					fn:sort($m[bin:and(xs:positiveInteger(?spectre), $v) ne xs:positiveInteger(0)] ! local-name())
				}</td></tr>
			}</table>
		</body>
	}
</html>