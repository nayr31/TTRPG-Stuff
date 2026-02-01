<%*
await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
  frontmatter["Portrait"] = "[[playernodata.png]]"
  frontmatter["Pronouns"] = ""
  frontmatter["Notes"] = ""
})
await tp.file.move(tp.file.folder(true) + "/NPCs/" + tp.file.title)
%>