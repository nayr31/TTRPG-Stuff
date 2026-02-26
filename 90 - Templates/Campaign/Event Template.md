<%*
// Update the frontmatter
await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
  frontmatter["Notes"] = ""
  frontmatter["Connections"] = []
})

// Rename and move
let path = tp.file.folder(true) + (tp.file.folder(false) == "Events" ? "/" : "/World/Events/") + tp.file.title
await tp.file.move(path)
%>