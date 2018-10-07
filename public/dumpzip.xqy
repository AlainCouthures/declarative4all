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
	<body>
		<pre>{
			serialize(doc('public/odk_sample_form.xlsx'), map{"indent": "yes"})
		}</pre>
	</body>
</html>