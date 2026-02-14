<%*
tp.hooks.on_all_templates_executed(async () => {
	// Update the frontmatter
	await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
	  frontmatter["isMe"] = false
	  frontmatter["Portrait"] = "[[playernodata.png]]"
	  frontmatter["Pronouns"] = ""
	  frontmatter["Race"] = ""
	  frontmatter["Class"] = ""
	  frontmatter["Connections"] = []
	})
})

// Rename and move
let path = tp.file.folder(true) + (tp.file.folder(false) == "Players" ? "/" : "/Players/") + tp.file.title
await tp.file.move(path)
%>

# 🔗 Connections
![[Connections.base#Character Connections]]