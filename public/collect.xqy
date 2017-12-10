declare %updating function local:updatejsonfile($path, $k, $v) {
	let $doc := fn:doc($path)
	let $m := $doc/map()
	let $update := (
		if ($m?($k)) then
			replace node $m?($k)/node() with $v
		else
			insert node entry {$k} {$v} into $m)
	let $write := file:write($path, $doc, map {"indent" : "yes"})
	return $v
};
let $filename := '../private/collect.json'
let $filekey := 'computername'
let $query := request:query-map()
let $key := xs:string($query?($filekey))
let $m := map:put(map:remove($query, $filekey), 'timestamp', xs:string(fn:current-dateTime()))
return local:updatejsonfile($filename, $key, $m)