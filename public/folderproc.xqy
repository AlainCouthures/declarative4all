declare function local:filesproc($items, $proc) {
	$items ! (if (file:is-dir(.)) then ($proc(), local:filesproc(file:children(.), $proc)) else $proc())
};
<html>
	<body>
		{
			let $srcdir := file:resolve-path('/My Web Sites/XForms Test Suite/homepages.cwi.nl/_steven/forms/TestSuite')
			let $destdir := file:resolve-path('/My Web Sites/NewCopy')
			let $foldercount := 0
			let $filecount := 0
			let $fileproc := function() {
				if (fn:ends-with(., '.xhtml')) then
					let $d := (fn:trace(.),fn:doc(.))
					return
						(replace value of node $d/processing-instruction('xml-stylesheet')/text() with 'type="text/xsl" href="xsl/xsltforms.xsl"',
						file:write(substring-before($destdir || fn:substring-after(., $srcdir), '.xhtml') || '.xml', $d))
				else file:copy(., $destdir || fn:substring-after(., $srcdir)),
				replace value of node $filecount with $filecount + 1,
				fn:trace((), xs:string($foldercount) || ' Folders, ' || xs:string($filecount) || ' Files')
			}
			return
				(file:delete($destdir, true()),
				local:filesproc($srcdir, function() {
					if (file:is-dir(.)) then
						(file:create-dir($destdir || fn:substring-after(., $srcdir)),
						replace value of node $foldercount with $foldercount + 1,
						fn:trace((), xs:string($foldercount) || ' Folders, ' || xs:string($filecount) || ' Files'))
					else
						$fileproc()
				}),
				'Finished!')
				(:
				(file:resolve-path('/My Web Sites/XForms Test Suite/homepages.cwi.nl/_steven/forms/TestSuite/functions/avg.xhtml') ! $fileproc(),
				'Finished!')
				:)
		}
	</body>
</html>