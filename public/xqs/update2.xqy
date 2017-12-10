declare %updating function local:sleep2() {
	prof:sleep(2000)
};
<html>
	<head>
		<title>XQS Update2</title>
		<style>
			body {{
				font-family: arial,sans-serif;
				font-size: 80%;
			}}
		</style>
	</head>
	<body>
		<p>{fn:current-time()} {local:sleep2()}Update2! {fn:current-time()}</p>
	</body>
</html>