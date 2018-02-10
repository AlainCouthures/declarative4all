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
		let $m := fn:doc('../private/collect.json')/map()
		return <body>
			<p>{
				fn:format-dateTime(file:last-modified('../private/collect.json'), '[h01]:[m01]:[s01] [D]/[M]/[Y,2-2]') || ' - ' || fn:count($m/entry()) || ' ordinateurs dans l''inventaire'
			}</p>
			<h1>R&eacute;partition Windows</h1>
			<table>{
				for $v in fn:sort(fn:distinct-values($m/entry()/map()/entry()[local-name() eq 'version']/text()))
				return <tr><td>{$v}</td><td>{
					fn:sort($m/entry()[map()/entry()[local-name() eq 'version' and text() eq $v]] ! local-name())
				}</td></tr>
			}</table>
			<h1>R&eacute;partition Office</h1>
			<table>
				<tr><td>absent</td><td>{
					fn:sort($m/entry()[map()[count(entry()[local-name() eq 'office']) eq 0]] ! local-name())
				}</td></tr>
				{
				for $v in fn:sort(fn:distinct-values($m/entry()/map()/entry()[local-name() eq 'office']/text()))
				return <tr><td>{$v}</td><td>{
					fn:sort($m/entry()[map()/entry()[local-name() eq 'office' and text() eq $v]] ! local-name())
				}</td></tr>
			}</table>
			<h1>R&eacute;partition VLAN</h1>
			<table>
				<tr><td>absent</td><td>{
					fn:sort($m/entry()[map()/entry()[local-name() eq 'ip' and text() eq '']] ! local-name())
				}</td></tr>
				{
				for $v in ('16','17','18','19','23','24')
				return <tr><td>{$v}</td><td>{
					fn:sort($m/entry()[map()/entry()[local-name() eq 'ip' and starts-with(text(), '172.' || $v)]] ! local-name())
				}</td></tr>
			}</table>
			<h1>R&eacute;partition Spectre-Meltdown</h1>
			<table>
				<tr><td>inconnu</td><td>{
					fn:sort($m/entry()[map()[count(entry()[local-name() eq 'spectre']) eq 0]] ! local-name())
				}</td></tr>
				<tr><td>OK</td><td>{
					fn:sort($m/entry()[map()/entry()[local-name() eq 'spectre' and text() eq '0']] ! local-name())
				}</td></tr>
				<tr><td>Vuln&eacute;rable</td><td>{
					fn:sort($m/entry()[map()/entry()[local-name() eq 'spectre' and (text() eq '12' or text() eq '8' or text() eq '4')]] ! local-name())
				}</td></tr>
				{
				let $errcodes := map {"3":"Pb Windows", "48":"Pb mat&eacute;riel", "192":"Protection d&eacute;sactiv&eacute;e"}
				for $v in (xs:positiveInteger(3), xs:positiveInteger(48), xs:positiveInteger(192))
				return <tr><td>{$errcodes/entry()[local-name() eq xs:string($v)]/text()}</td><td>{
					fn:sort($m/entry()[map()/entry()[local-name() eq 'spectre' and bin:and(xs:positiveInteger(text()), $v) ne xs:positiveInteger(0)]] ! local-name())
				}</td></tr>
			}</table>
		</body>
	}
</html>