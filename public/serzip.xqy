<html>
	<head>
		<title>Serialized ZIP</title>
		<style>
			body {{
				font-family: arial,sans-serif;
				font-size: 100%;
			}}
			table {{
				border-collapse: collapse;
			}}
			table, th, td {{
				border: 1px solid black;
			}}
		</style>
	</head>
	<body>{
		let $files := doc('public/test.xlsx')/array()/map()
		for $file in $files
		return <div>
				<p>{xs:string($file?fileName)}</p>
				<pre>{serialize(parse-xml(zip:inflate($file?compressedFileData)), map{'indent': 'yes'})}</pre>
			</div>
	}</body>
</html>