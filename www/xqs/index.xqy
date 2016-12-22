(:
declare namespace output = "http://www.w3.org/2010/xslt-xquery-serialization";
declare namespace proc = "http://basex.org/modules/proc";
declare option output:method "html";
:)
<html>
	<head>
		<title>XQS Home Page</title>
		<style>
			body {{
				font-family: arial,sans-serif;
				font-size: 80%;
			}}
		</style>
	</head>
	<body>
		<h1>XQS Home Page</h1>
		<table>
			<tr>
				<td>Host Name:</td>
				<td>{proc:property('host-name')}</td>
			</tr>
			<tr>
				<td>Host Addresses:</td>
				<td>{proc:property('host-addresses')}</td>
			</tr>
			<tr>
				<td>Host Engine:</td>
				<td>{proc:property('host-engine')}</td>
			</tr>
			<tr>
				<td>XQuery Engine:</td>
				<td>{proc:property('xquery-engine')}</td>
			</tr>
		</table>
	</body>
</html>