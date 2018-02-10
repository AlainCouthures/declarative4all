<html>
	<head>
		<title>Repartition Office</title>
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
			<h1>Repartition Office</h1>
			<p>{
				fn:format-dateTime(file:last-modified('../private/collect.json'), '[h01]:[m01]:[s01] [D]/[M]/[Y,2-2]') || ' - ' || fn:count($m/entry()) || ' ordinateurs dans l''inventaire'
			}</p>
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
		</body>
	}
</html>