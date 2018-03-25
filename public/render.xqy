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
		let $m := fn:doc('../private/collect.json')?*
		let $vlans := fn:doc('public/aruba/vlans.json')?*
		return <body>
			<p>{
				fn:format-dateTime(file:last-modified('../private/collect.json'), '[h01]:[m01]:[s01] [D]/[M]/[Y,2-2]') || ' - ' || fn:count($m) || ' ordinateurs dans l''inventaire'
			}</p>
			<h1>R&eacute;partition Windows</h1>
			<table>{
				for $v in fn:sort(fn:distinct-values($m?version))
				return <tr><td>{$v}</td><td>{
					fn:sort($m[?version eq $v] ! local-name())
				}</td></tr>
			}</table>
			<h1>R&eacute;partition Office</h1>
			<table>
				<tr><td>absent</td><td>{
					fn:sort($m[not(?office)] ! local-name())
				}</td></tr>
				{
				for $v in fn:sort(fn:distinct-values($m?office))
				return <tr><td>{$v}</td><td>{
					fn:sort($m[?office eq $v] ! local-name())
				}</td></tr>
			}</table>
			<h1>R&eacute;partition VLAN</h1>
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
			<h1>R&eacute;partition Spectre-Meltdown</h1>
			<table>
				<tr><td>inconnu</td><td>{
					fn:sort($m[not(?spectre)] ! local-name())
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