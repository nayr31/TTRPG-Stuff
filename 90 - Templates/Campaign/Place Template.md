<%*
tp.hooks.on_all_templates_executed(async () => {
	// Update the frontmatter
	await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
	  frontmatter["Notes"] = ""
	  frontmatter["Related"] = []
	})
})

// Rename and move
let path = tp.file.folder(true) + (tp.file.folder(false) == "Places" ? "/" : "/World/Places/") + tp.file.title
await tp.file.move(path)
%>