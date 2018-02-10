<html>
	<body>
		{
			let $src := '/My Web Sites/XForms Test Suite/homepages.cwi.nl/_steven/forms/TestSuite'
			let $content := file:children($src)
			let $folders := $content[file:is-dir(.)]
			return $folders ! (.,<br/>)
		}
	</body>
</html>