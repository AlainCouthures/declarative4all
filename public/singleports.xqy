<html>
	<head>
		<title>Single Ports</title>
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
let $switches := ("BDX-LT3-SW-01",
				"BDX-LT3-1-SW-01",
				"BDX-LT5-SW-01",
				"BDX-LT6-SW-01",
				"BDX-LT6-1-SW-01",
				"BDX-LT7-SW-01",
				"BDX-LT8-SW-01",
				"BDX-LT9-SW-01",
				"BDX-LT12-SW-01")
for $switch in $switches
let $vps := doc('public/aruba/' || $switch || '_vlans-ports.json')/map()?vlan_port_element/array()
let $macs := doc('public/aruba/' || $switch || '_mac-table.json')/map()?mac_table_entry_element/array()
let $trk := $vps/map()[.?port_mode eq 'POM_TAGGED_STATIC'] ! .?port_id/text()
for $port in $vps/map()[not(.?port_id = $trk)] ! .?port_id/text()
return ($switch || ' ' || $port || ' ' || ($macs/map()[.?port_id eq $port] ! .?mac_address/text()), <br/>)
		}
	</body>
</html>