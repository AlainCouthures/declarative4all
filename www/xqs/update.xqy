<html>
	<head>
		<title>XQS Update</title>
		<style>
			body {{
				font-family: arial,sans-serif;
				font-size: 80%;
			}}
		</style>
	</head>
	<body>
		<p>{(prof:sleep(5000),fn:trace('Update! ' || fn:current-time()))}Update! {fn:current-time()}</p>
	</body>
</html>