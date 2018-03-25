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
let $pcs := fn:doc('../private/collect.json')?*
let $switches := fn:doc('public/aruba/switches.json')?*
for $switch in $switches
let $vps := doc('public/aruba/' || local-name($switch) || '_vlans-ports.json')?vlan_port_element?*
let $macs := doc('public/aruba/' || local-name($switch) || '_mac-table.json')?mac_table_entry_element?*
let $trk := $vps[?port_mode eq 'POM_TAGGED_STATIC'] ! xs:string(?port_id)
for $port in $vps[not(?port_id = $trk)] ! ?port_id
return (local-name($switch) || ' ' || $port || ' ' || (
	let $portmacs := $macs[?port_id eq $port] ! ietf:mac(?mac_address)
	return if ($portmacs) then (
		for $portmac in $portmacs
		return local-name($pcs[ietf:mac(?mac) eq $portmac])
	) else ()
), <br/>)
		}
	</body>
</html>