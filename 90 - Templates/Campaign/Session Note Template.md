<%*
// Ask for the session number and create the alias for the campaign file
const sessionNum = await tp.system.prompt("Which session is it?")
if (!sessionNum) return
const path = tp.file.folder(true) + (tp.file.folder(false) == "Session Notes" ? "/" : "/Session Notes/") + "Session " + sessionNum
await tp.file.move(path)

let campaignName = ""
// Update the frontmatter
await app.fileManager.processFrontMatter(tp.config.target_file, (frontmatter) => {
  frontmatter["Date"] = tp.date.now("YYYY-MM-DD")
  frontmatter["Notes"] = ""
  let folderPath = tp.file.folder(true).split("/")
  folderPath.pop() // Pop the Session Notes folder
  campaignName = folderPath.pop() // Pop the campaign name -> has to happen AFTER moved
  frontmatter["Campaign"] = campaignName
})

// Grab the campaign file
folderPath = tp.file.folder(true).split("/")
folderPath.pop() // Pop session
const targetFile = tp.file.find_tfile(folderPath.join("/") + "/⭐ " + campaignName)

// Update the campaign file with the latest session note
if (targetFile) {
    await app.fileManager.processFrontMatter(targetFile, (frontmatter) => {
        // This creates an Obsidian-style link to the new note
        const sessionName = tp.file.folder(true) + "/Session " + sessionNum + "|Session " + sessionNum
        frontmatter["Latest Session"] = `[[${sessionName}]]`;
    })
} else {
	new Notice("Failed to update campaign file.")
	console.log("Failed to find campaign file to update latest session.")
}
%>