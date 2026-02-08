<%*
// Move the session note inside of the right folder
let path = tp.file.folder(true) + (tp.file.folder(false) == "Session Notes" ? "/" : "/Session Notes/") + tp.file.title
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

// Ask for the session number and create the alias for the campaign file
const sessionNum = await tp.system.prompt("Which session is it?")
const sessionName = tp.file.folder(true) + "/Session " + sessionNum + "|Session " + sessionNum
await tp.file.rename("Session " + sessionNum)

// Grab the campaign file
folderPath = tp.file.folder(true).split("/")
folderPath.pop() // Pop session
const targetFile = tp.file.find_tfile(folderPath.join("/") + "/⭐ " + campaignName)

// Update the campaign file with the latest session note
if (targetFile) {
    await app.fileManager.processFrontMatter(targetFile, (frontmatter) => {
        // This creates an Obsidian-style link to the new note
        frontmatter["Latest Session"] = `[[${sessionName}]]`;
    });
} else {
	console.log("Failed to find campaign file to update latest session.")
}
%>