<%*
let path = tp.file.folder(true) + (tp.file.folder(false) == "Session Notes" ? "/" : "/Session Notes/") + tp.file.title
await tp.file.move(path)

await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
  frontmatter["Date"] = tp.date.now("YYYY-MM-DD")
  frontmatter["Notes"] = ""
  let folderPath = tp.file.folder(true).split("/")
  folderPath.pop() // Pop the Session Notes folder
  frontmatter["Campaign"] = folderPath.pop() // Pop the campaign name -> has to happen AFTER moved
})

let sessionNum = await tp.system.prompt("Which session is it?")
await tp.file.rename("Session " + sessionNum)
tp.file.cursor()
%>