declare %updating function local:sleep5() {
	prof:sleep(5000)
};
<html>
	<head>
		<title>XQS Update5</title>
		<style>
			body {{
				font-family: arial,sans-serif;
				font-size: 80%;
			}}
		</style>
	</head>
	<body>
		<p>{fn:current-time()} {local:sleep5()}Update5! {fn:current-time()}</p>
	</body>
</html>