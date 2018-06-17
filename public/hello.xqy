let $batch := request:body-doc()
let $tstamp := current-dateTime()
return $tstamp || ': Hello ' || $batch?name || '!'