<html>
	<head>
		<title>API REST switch aruba</title>
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
		{
			let $switches := fn:doc('public/aruba/switches.json')?*
			let $login := fn:doc('public/aruba/login.json')
			for $switch in $switches
			let $m := fn:doc('http://' || xs:string($switch) || ':80/rest/v3/login-sessions', map {'method': 'json', 'http-verb': 'POST', 'timeout': '300'}, map {'userName': xs:string($login?user), 'password': xs:string($login?password)})
			let $t := fn:trace((), local-name($switch) || ' ' || fn:serialize($m, map {'method': 'json'}) || ' ')
			return (if ($m?cookie) then
					(let $sessionId := map {'method': 'json', 'http-verb': 'GET', 'http-cookie': xs:string($m?cookie), 'timeout': '300'}
					let $mac-table := file:write('../private/' || local-name($switch) || '_mac-table.json', fn:doc('http://' || xs:string($switch) || ':80/rest/v3/mac-table', $sessionId), map {'method': 'json', 'indent': 'yes'})
					let $vlans := file:write('../private/' || local-name($switch) || '_vlans.json', fn:doc('http://' || xs:string($switch) || ':80/rest/v3/vlans', $sessionId), map {'method': 'json', 'indent': 'yes'})
					let $vlans-ports := file:write('../private/' || local-name($switch) || '_vlans-ports.json', fn:doc('http://' || xs:string($switch) || ':80/rest/v3/vlans-ports', $sessionId), map {'method': 'json', 'indent': 'yes'})
					return (local-name($switch) || ' processed.' , <br/>))
				else (local-name($switch) || ' not responding at ' || xs:string($switch) , <br/>))
		}
	</body>
</html>