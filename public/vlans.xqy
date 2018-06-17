<html>
	<head>
		<title>VLANs</title>
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
		<table>
			<tr>
				<td>Switchs</td>
				<td>VLANs</td>
			</tr>
				{
let $switches := doc('public/aruba/switches.json')?*
let $login := doc('public/aruba/login.json')
for $switch in $switches
	let $m := fn:doc('http://' || xs:string($switch) || ':80/rest/v3/login-sessions', map {'method': 'json', 'http-verb': 'POST', 'timeout': '300'}, map {'userName': xs:string($login?user), 'password': xs:string($login?password)})
	return <tr><td>{local-name($switch)}</td><td>{(if ($m?cookie) then
		(let $sessionId := map {'method': 'json', 'http-verb': 'GET', 'http-cookie': xs:string($m?cookie), 'timeout': '300'}
		let $vlans := doc('http://' || xs:string($switch) || ':80/rest/v3/vlans', $sessionId)?vlan_element?*?name ! xs:string(.)
		return sort(distinct-values($vlans))[starts-with(., 'BDX-')] ! (xs:string(.), <br/>)
		) else ())}</td></tr>
				}
		</table>
	</body>
</html>