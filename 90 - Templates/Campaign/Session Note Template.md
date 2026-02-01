<%*
await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
  frontmatter["Date"] = tp.date.now("YYYY-MM-DD")
  frontmatter["Notes"] = ""
})
await tp.file.move(tp.file.folder(true) + "/Session Notes/" + tp.file.title)

let sessionNum = await tp.system.prompt("Which session is it?")
await tp.file.rename("Session " + sessionNum)
tp.file.cursor()
%>