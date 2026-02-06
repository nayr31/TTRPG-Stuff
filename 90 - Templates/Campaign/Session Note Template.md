<%*
await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
  frontmatter["Date"] = tp.date.now("YYYY-MM-DD")
  frontmatter["Notes"] = ""
})
let path = tp.file.folder(true) + (tp.file.folder(false) == "Session Notes" ? "/" : "/Session Notes/") + tp.file.title
await tp.file.move(path)

let sessionNum = await tp.system.prompt("Which session is it?")
await tp.file.rename("Session " + sessionNum)
tp.file.cursor()
%>