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
				<td>VLANs</td>
				<td>Switches</td>
			</tr>
		{
let $switches := ("BDX-LT3-SW-01",
				"BDX-LT3-1-SW-01",
				"BDX-LT5-SW-01",
				"BDX-LT6-SW-01",
				"BDX-LT6-1-SW-01",
				"BDX-LT7-SW-01",
				"BDX-LT8-SW-01",
				"BDX-LT9-SW-01",
				"BDX-LT12-SW-01")
let $v := (for $switch in $switches
  return doc('public/aruba/' || $switch || '_vlans.json')/map()?vlan_element/array()/map()?name ! xs:string(.))
return sort(distinct-values($v))[starts-with(., 'BDX-')] ! <tr><td>{.}</td><td>{
	let $vl := .
	return $switches[doc('public/aruba/' || . || '_vlans.json')/map()?vlan_element/array()/map()?name[text() eq $vl]] ! (xs:string(.), <br/>)
}</td></tr>
		}
		</table>
	</body>
</html>