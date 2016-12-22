<html>
	<head>
		<title>XQS File Module Test Page</title>
		<style>
			body {{
				font-family: arial,sans-serif;
				font-size: 80%;
			}}
		</style>
	</head>
	<body>
		<h1>XQS File Module Test Page</h1>
		<table>
			<tr>
				<td>file:exists('C:/Windows')</td>
				<td>{file:exists('C:/Windows')}</td>
			</tr>
			<tr>
				<td>file:exists('C:/Windows/toto.bid')</td>
				<td>{file:exists('C:/Windows/toto.bid')}</td>
			</tr>
			<tr>
				<td>file:exists('C:/Program Files')</td>
				<td>{file:exists('C:/Program Files')}</td>
			</tr>
			<tr>
				<td>file:is-dir('C:/Program Files (x86)')</td>
				<td>{file:is-dir('C:/Program Files (x86)')}</td>
			</tr>
			<tr>
				<td>file:is-dir('C:/Windows/explorer.exe')</td>
				<td>{file:is-dir('C:/Windows/explorer.exe')}</td>
			</tr>
			<tr>
				<td>file:is-file('C:/Program Files')</td>
				<td>{file:is-file('C:/Program Files')}</td>
			</tr>
			<tr>
				<td>file:is-file('C:/Windows/explorer.exe')</td>
				<td>{file:is-file('C:/Windows/explorer.exe')}</td>
			</tr>
			<tr>
				<td>file:is-absolute('C:/Program Files (x86)')</td>
				<td>{file:is-absolute('C:/Program Files (x86)')}</td>
			</tr>
			<tr>
				<td>file:is-absolute('Windows/explorer.exe')</td>
				<td>{file:is-absolute('Windows/explorer.exe')}</td>
			</tr>
			<tr>
				<td>file:last-modified('C:/Windows/explorer.exe')</td>
				<td>{file:last-modified('C:/Windows/explorer.exe')}</td>
			</tr>
			<tr>
				<td>file:size('C:/Windows/explorer.exe')</td>
				<td>{file:size('C:/Windows/explorer.exe')}</td>
			</tr>
			<tr>
				<td>file:size('C:/Windows')</td>
				<td>{file:size('C:/Windows')}</td>
			</tr>
			<tr>
				<td>file:dir-separator()</td>
				<td>{file:dir-separator()}</td>
			</tr>
			<tr>
				<td>file:line-separator()</td>
				<td>{file:line-separator()}</td>
			</tr>
			<tr>
				<td>file:path-separator()</td>
				<td>{file:path-separator()}</td>
			</tr>
			<tr>
				<td>file:temp-dir()</td>
				<td>{file:temp-dir()}</td>
			</tr>
			<tr>
				<td>file:current-dir()</td>
				<td>{file:current-dir()}</td>
			</tr>
			<tr>
				<td>file:base-dir()</td>
				<td>{file:base-dir()}</td>
			</tr>
			<tr>
				<td>file:name('C:/Windows/explorer.exe')</td>
				<td>{file:name('C:/Windows/explorer.exe')}</td>
			</tr>
			<tr>
				<td>file:name('explorer.exe')</td>
				<td>{file:name('explorer.exe')}</td>
			</tr>
			<tr>
				<td>file:name('/')</td>
				<td>{file:name('/')}</td>
			</tr>
		</table>
	</body>
</html>