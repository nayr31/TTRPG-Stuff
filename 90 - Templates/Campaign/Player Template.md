<%*
await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
  frontmatter["isMe"] = false
  frontmatter["Portrait"] = "[[playernodata.png]]"
  frontmatter["Pronouns"] = ""
  frontmatter["Race"] = ""
  frontmatter["Class"] = ""
})
await tp.file.move(tp.file.folder(true) + "/Players/" + tp.file.title)
%>