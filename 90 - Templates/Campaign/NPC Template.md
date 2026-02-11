<%*
// Update the frontmatter
await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
  frontmatter["Portrait"] = "[[playernodata.png]]"
  frontmatter["Pronouns"] = ""
  frontmatter["Notes"] = ""
  frontmatter["Connections"] = []
})

// Rename and move
let path = tp.file.folder(true) + (tp.file.folder(false) == "NPCs" ? "/" : "/NPCs/") + tp.file.title
await tp.file.move(path)
%>