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
			let $switchs := map {
				"BDX-LT3-SW-01": "172.20.20.247",
				"BDX-LT3-1-SW-01": "172.20.20.246",
				"BDX-LT5-SW-01": "172.20.20.244",
				"BDX-LT6-SW-01": "172.20.20.245",
				"BDX-LT6-1-SW-01": "172.20.20.243",
				"BDX-LT7-SW-01": "172.20.20.239",
				"BDX-LT8-SW-01": "172.20.20.238",
				"BDX-LT9-SW-01": "172.20.20.237",
				"BDX-LT12-SW-01": "172.20.20.241"
			}
			for $switch in $switchs/entry()
			let $m := fn:doc('http://' || xs:string($switch) || ':80/rest/v3/login-sessions', map {'method': 'json', 'http-verb': 'POST', 'timeout': '300'}, map {'userName': 'admin', 'password': 'JBLS2k18*'})/map()
			let $t := fn:trace((), local-name($switch) || ' ' || fn:serialize($m, map {'method': 'json'}) || ' ')
			return (if ($m?cookie) then
					(let $sessionId := map {'method': 'json', 'http-verb': 'GET', 'http-cookie': xs:string($m?cookie), 'timeout': '300'}
					let $mac-table := file:write('../private/' || local-name($switch) || '_mac-table.json', fn:doc('http://' || xs:string($switch) || ':80/rest/v3/mac-table', $sessionId), map {'method': 'json', 'indent': 'yes'})
					let $vlans := file:write('../private/' || local-name($switch) || '_vlans.json', fn:doc('http://' || xs:string($switch) || ':80/rest/v3/vlans', $sessionId), map {'method': 'json', 'indent': 'yes'})
					let $vlans-ports := file:write('../private/' || local-name($switch) || '_vlans-ports.json', fn:doc('http://' || xs:string($switch) || ':80/rest/v3/vlans-ports', $sessionId), map {'method': 'json', 'indent': 'yes'})
					return (local-name($switch) || ' processed.' , <br/>))
				else (local-name($switch) || ' not responding at ' || xs:string($switch) , <br/>))
			(:
				"BDX-LT2-SW-01": "172.20.20.248",
				"BDX-LT2-1-SW-01": "172.20.20.249",
				"BDX-LT4-SW-01": "172.20.20.242",
				"BDX-LT5-SW-01": "172.20.20.244",
				"BDX-LT6-SW-01": "172.20.20.245",
				"BDX-LT6-1-SW-01": "172.20.20.243",
				"BDX-LT7-SW-01": "172.20.20.239",
				"BDX-LT8-SW-01": "172.20.20.238",
				"BDX-LT9-SW-01": "172.20.20.237",
				"BDX-LT11-SW-01": "172.20.20.235",
				"BDX-LT12-SW-01": "172.20.20.241",
				"BDX-LT12-2-SW-01": "172.20.20.240",
				"BDX-LT12-3-SW-01": "172.20.20.239",
				"BDX-LT13-SW-01": "172.20.20.250",
				"BDX-LT14-SW-01": "172.20.20.234",
				"BDX-LT15-SW-01": "172.20.20.233"			:)
			(:
			return (local-name($switch) || ' not responding at ' || xs:string($switch) , <br/>)
			:)
		}
	</body>
</html>